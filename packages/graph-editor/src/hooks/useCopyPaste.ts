import { graphEditorSelector } from '@/redux/selectors/graph.js';
import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/useToast.js';
import { v4 as uuidv4 } from 'uuid';
import { xpos, ypos } from '@/annotations/index.js';

function useCopyPaste() {
  const graphRef = useSelector(graphEditorSelector);
  const reactFlowInstance = useReactFlow();
  const toast = useToast();

  const copySelectedNodes = useCallback(() => {
    if (!graphRef) return;

    const flow = graphRef.getFlow();
    const graph = graphRef.getGraph();
    const selectedNodes = flow.getNodes().filter((node) => node.selected);
    const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));

    // create a subgraph with only the selected nodes
    const subGraph = graph.serialize();
    subGraph.nodes = subGraph.nodes.filter((node) =>
      selectedNodeIds.has(node.id),
    );
    const originalEdges = subGraph.edges;
    subGraph.edges = originalEdges
      .filter(
        (edge) =>
          selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target),
      )
      .map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      }));

    // remove viewport from annotations
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { 'ui.viewport': _, ...restAnnotations } = subGraph.annotations;
    subGraph.annotations = restAnnotations;

    const serialized = JSON.stringify(subGraph);

    navigator.clipboard
      .writeText(serialized)
      .then(() => {
        toast({
          title: 'Copied',
          description: `${selectedNodes.length} nodes copied to clipboard`,
        });
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: `Failed to copy: ${(error as Error).message}`,
        });
      });
  }, [graphRef, toast]);

  const updateNodeIdsRecursively = useCallback((node, idMapping) => {
    const newId = uuidv4();
    idMapping.set(node.id, newId);
    
    const updatedNode = {
      ...node,
      id: newId,
    };
    
    // if this node has an innergraph, process it recursively
    if (node.innergraph) {
      const innerIdMapping = new Map();
      
      if (Array.isArray(node.innergraph.nodes)) {
        updatedNode.innergraph = {
          ...node.innergraph,
          nodes: node.innergraph.nodes.map(innerNode => 
            updateNodeIdsRecursively(innerNode, innerIdMapping)
          ),
          // update edge references in the subgraph
          edges: Array.isArray(node.innergraph.edges) 
            ? node.innergraph.edges.map(edge => ({
                ...edge,
                id: uuidv4(),
                source: innerIdMapping.get(edge.source) || edge.source,
                target: innerIdMapping.get(edge.target) || edge.target,
              })) 
            : []
        };
        
        // update innergraph ID
        if (node.innergraph.annotations && node.innergraph.annotations['engine.id']) {
          updatedNode.innergraph.annotations = {
            ...node.innergraph.annotations,
            'engine.id': uuidv4(),
          };
        }
      }
    }
    
    return updatedNode;
  }, []);

  const pasteFromClipboard = useCallback(() => {
    if (!graphRef) return;

    navigator.clipboard.readText().then(async (text) => {
      try {
        const { nodes: sourceNodes, edges: sourceEdges } = JSON.parse(text);

        if (!Array.isArray(sourceNodes) || !Array.isArray(sourceEdges)) {
          toast({
            title: 'Error',
            description: 'Invalid clipboard data',
          });
          return;
        }

        // get the center of the visible area in flow coordinates
        const topLeft = reactFlowInstance.screenToFlowPosition({ x: 0, y: 0 });
        const bottomRight = reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth,
          y: window.innerHeight,
        });

        const viewportCenter = {
          x: (topLeft.x + bottomRight.x) / 2,
          y: (topLeft.y + bottomRight.y) / 2,
        };

        // calculate bounding box of source nodes (these are already in flow coordinates)
        const pasteBounds = sourceNodes.reduce(
          (acc, node) => ({
            minX: Math.min(acc.minX, node.annotations?.[xpos] || 0),
            minY: Math.min(acc.minY, node.annotations?.[ypos] || 0),
            maxX: Math.max(
              acc.maxX,
              (node.annotations?.[xpos] || 0) +
                (node.annotations?.['ui.width'] || 200),
            ),
            maxY: Math.max(
              acc.maxY,
              (node.annotations?.[ypos] || 0) +
                (node.annotations?.['ui.height'] || 100),
            ),
          }),
          {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
          },
        );

        // calculate offset to center the pasted nodes
        const offset = {
          x: viewportCenter.x - (pasteBounds.minX + pasteBounds.maxX) / 2,
          y: viewportCenter.y - (pasteBounds.minY + pasteBounds.maxY) / 2,
        };

        // create new nodes with updated positions and IDs
        const idMapping = new Map();
        const nodes = sourceNodes.map(node => {
          // first update all node and subgraph IDs
          const updatedNode = updateNodeIdsRecursively(node, idMapping);
          
          // then update positioning
          return {
            ...updatedNode,
            annotations: {
              ...updatedNode.annotations,
              xpos:
                (updatedNode.annotations?.[xpos] || 0) + offset.x,
              ypos:
                (updatedNode.annotations?.[ypos] || 0) + offset.y,
            },
          };
        });

        // create new edges with updated references
        const edges = sourceEdges
          .filter(
            (edge) => idMapping.has(edge.source) && idMapping.has(edge.target),
          )
          .map((edge) => ({
            ...edge,
            id: uuidv4(),
            source: idMapping.get(edge.source),
            target: idMapping.get(edge.target),
          }));

        // store viewport state
        const viewportState = reactFlowInstance.getViewport();

        // merge and load new graph with selected nodes
        const currentGraph = graphRef.getGraph().serialize();
        const mergedGraph = {
          ...currentGraph,
          nodes: [...currentGraph.nodes, ...nodes].map((node) => ({
            ...node,
            selected: idMapping.has(node.id),
          })),
          edges: [...currentGraph.edges, ...edges],
        };

        // load the graph with selection state
        await graphRef.loadRaw(mergedGraph);

        // restore viewport and update ReactFlow state
        reactFlowInstance.setViewport(viewportState);

        // update ReactFlow's internal state
        requestAnimationFrame(() => {
          reactFlowInstance.setNodes(reactFlowInstance.getNodes());
          reactFlowInstance.setEdges(reactFlowInstance.getEdges());
        });

        toast({
          title: 'Pasted',
          description: `${nodes.length} nodes pasted`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to paste: ${(error as Error).message}`,
        });
      }
    });
  }, [graphRef, reactFlowInstance, toast, updateNodeIdsRecursively]);

  return {
    copySelectedNodes,
    pasteFromClipboard,
  };
}

export default useCopyPaste;
