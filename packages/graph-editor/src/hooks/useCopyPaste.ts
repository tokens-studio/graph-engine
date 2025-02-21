import { graphEditorSelector } from '@/redux/selectors/graph.js';
import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/useToast.js';
import { v4 as uuidv4 } from 'uuid';

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

  const pasteFromClipboard = useCallback(() => {
    if (!graphRef) return;

    navigator.clipboard.readText().then(async (text) => {
      try {
        const { nodes: sourceNodes, edges: sourceEdges } = JSON.parse(text);

        // get target position in flow coordinates
        const flowContainer = document.querySelector('.react-flow');
        const flowBounds = flowContainer?.getBoundingClientRect() || {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        const targetPosition = reactFlowInstance.project({
          x: flowBounds.width / 2,
          y: flowBounds.height / 2,
        });

        // calculate bounding box of source nodes (these are already in flow coordinates)
        const pasteBounds = sourceNodes.reduce(
          (acc, node) => ({
            minX: Math.min(acc.minX, node.annotations?.['ui.position.x'] || 0),
            minY: Math.min(acc.minY, node.annotations?.['ui.position.y'] || 0),
            maxX: Math.max(
              acc.maxX,
              node.annotations?.['ui.position.x'] ||
                0 + (node.annotations?.['ui.width'] || 200),
            ),
            maxY: Math.max(
              acc.maxY,
              node.annotations?.['ui.position.y'] ||
                0 + (node.annotations?.['ui.height'] || 100),
            ),
          }),
          {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
          },
        );

        // Calculate offset from bounding box center to target position
        const offset = {
          x: targetPosition.x - (pasteBounds.minX + pasteBounds.maxX) / 2,
          y: targetPosition.y - (pasteBounds.minY + pasteBounds.maxY) / 2,
        };

        // create new nodes with updated positions and IDs
        const idMapping = new Map();
        const nodes = sourceNodes.map((node) => {
          const newId = uuidv4();
          idMapping.set(node.id, newId);
          return {
            ...node,
            id: newId,
            annotations: {
              ...node.annotations,
              'ui.position.x':
                (node.annotations?.['ui.position.x'] || 0) + offset.x,
              'ui.position.y':
                (node.annotations?.['ui.position.y'] || 0) + offset.y,
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
  }, [graphRef, reactFlowInstance, toast]);

  return {
    copySelectedNodes,
    pasteFromClipboard,
  };
}

export default useCopyPaste;
