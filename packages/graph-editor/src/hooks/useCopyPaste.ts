import { Node as GraphNode, NodeFactory } from '@tokens-studio/graph-engine';
import { graphEditorSelector } from '@/redux/selectors/graph.js';
import { nodeTypesSelector } from '@/redux/selectors/registry.js';
import { useCallback, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { useSelectAddedNodes } from '@/hooks/useSelectAddedNodes.js';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/useToast.js';
import { v4 as uuidv4 } from 'uuid';
import { xpos, ypos } from '@/annotations/index.js';
import pluralizeValue from '@/utils/pluralizeValue.js';

function useCopyPaste() {
  const graphRef = useSelector(graphEditorSelector);
  const fullNodeLookup = useSelector(nodeTypesSelector) as Record<
    string,
    NodeFactory
  >;
  const reactFlowInstance = useReactFlow();
  const toast = useToast();
  const selectAddedNodes = useSelectAddedNodes();
  const pasteInProgressRef = useRef(false);

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
          description: `${pluralizeValue(selectedNodes.length, 'node')} copied to clipboard`,
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
          nodes: node.innergraph.nodes.map((innerNode) =>
            updateNodeIdsRecursively(innerNode, innerIdMapping),
          ),
          // update edge references in the subgraph
          edges: Array.isArray(node.innergraph.edges)
            ? node.innergraph.edges.map((edge) => ({
                ...edge,
                id: uuidv4(),
                source: innerIdMapping.get(edge.source) || edge.source,
                target: innerIdMapping.get(edge.target) || edge.target,
              }))
            : [],
        };

        // update innergraph ID
        if (
          node.innergraph.annotations &&
          node.innergraph.annotations['engine.id']
        ) {
          updatedNode.innergraph.annotations = {
            ...node.innergraph.annotations,
            'engine.id': uuidv4(),
          };
        }
      }
    }

    return updatedNode;
  }, []);

  const parseClipboardData = async () => {
    const text = await navigator.clipboard.readText();
    const { nodes: sourceNodes, edges: sourceEdges } = JSON.parse(text);
    return { sourceNodes, sourceEdges };
  };

  const calculateBoundingBox = (nodes) => {
    return nodes.reduce(
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
  };

  const calculatePastePosition = useCallback(
    (sourceNodes) => {
      const topLeft = reactFlowInstance.screenToFlowPosition({ x: 0, y: 0 });
      const bottomRight = reactFlowInstance.screenToFlowPosition({
        x: window.innerWidth,
        y: window.innerHeight,
      });

      const viewportCenter = {
        x: (topLeft.x + bottomRight.x) / 2,
        y: (topLeft.y + bottomRight.y) / 2,
      };

      const pasteBounds = calculateBoundingBox(sourceNodes);
      const offset = {
        x: viewportCenter.x - (pasteBounds.minX + pasteBounds.maxX) / 2,
        y: viewportCenter.y - (pasteBounds.minY + pasteBounds.maxY) / 2,
      };

      return offset;
    },
    [reactFlowInstance],
  );

  const prepareNodesForPasting = useCallback(
    (sourceNodes, sourceEdges, offset) => {
      const idMapping = new Map();

      // create new nodes with updated IDs and positions
      const updatedGraphNodes = sourceNodes.map((node) => {
        const updatedNode = updateNodeIdsRecursively(node, idMapping);

        return {
          ...updatedNode,
          annotations: {
            ...updatedNode.annotations,
            [xpos]: (updatedNode.annotations?.[xpos] || 0) + offset.x,
            [ypos]: (updatedNode.annotations?.[ypos] || 0) + offset.y,
          },
        };
      });

      // create new edges with updated references
      const updatedEdges = sourceEdges
        .filter(
          (edge) => idMapping.has(edge.source) && idMapping.has(edge.target),
        )
        .map((edge) => ({
          ...edge,
          id: uuidv4(),
          source: idMapping.get(edge.source),
          target: idMapping.get(edge.target),
        }));

      return { updatedGraphNodes, updatedEdges };
    },
    [updateNodeIdsRecursively],
  );

  const addNodesToGraph = useCallback(
    async (graph, nodes) => {
      // check for singleton nodes to avoid duplicating them
      const singletonChecks = nodes.map(async (node) => {
        if (node.annotations?.['engine.singleton']) {
          const existingNodes = (Object.values(graph.nodes) as GraphNode[]).filter(
            existingNode => existingNode.factory.type === node.type
          );
          
          // skip pasting this node if one of its type already exists
          if (existingNodes.length > 0) {
            console.warn(`Singleton node of type ${node.type} already exists`);
            return null;
          }
        }
        
        const factory = fullNodeLookup[node.type];
        if (factory) {
          await factory.deserialize({
            serialized: node,
            graph,
            lookup: fullNodeLookup
          });
          return node.id;
        }
        return null;
      });
      
      const addedNodeIds = await Promise.all(singletonChecks);
      return new Set(addedNodeIds.filter(Boolean));
    }, 
    [fullNodeLookup]
  );

  const addEdgesToGraph = useCallback(
    (graph, edges, validNodeIds) => {
      for (const edge of edges) {
        if (validNodeIds.has(edge.source) && validNodeIds.has(edge.target)) {
          try {
            graph.createEdge(edge);
          } catch (error) {
            console.error('Error creating edge:', error);
            toast({
              title: 'Error',
              description: `Error creating edge: ${(error as Error).message}`,
            });
          }
        }
      }
    },
    [toast],
  );

  const updateFlowUI = useCallback(
    (flow, nodes, edges, validNodeIds, viewportState) => {
      try {
        // add nodes to flow
        const newNodesForFlow = nodes
          .filter((node) => validNodeIds.has(node.id))
          .map((node) => ({
            id: node.id,
            type: node.annotations?.['ui.nodetype'] || 'GenericNode',
            data: {
              icon: node.annotations?.['ui.icon'] || '',
            },
            position: {
              x: node.annotations?.[xpos] || 0,
              y: node.annotations?.[ypos] || 0,
            },
          }));

        // add edges to flow
        const newEdgesForFlow = edges
          .filter(
            (edge) =>
              validNodeIds.has(edge.source) && validNodeIds.has(edge.target),
          )
          .map((edge) => ({
            ...edge,
            type: 'custom',
          }));

        // update the UI state
        flow.addNodes(newNodesForFlow);
        flow.addEdges(newEdgesForFlow);

        // restore viewport
        reactFlowInstance.setViewport(viewportState);

        return { newNodesForFlow, newEdgesForFlow };
      } catch (error) {
        console.error('Error updating flow:', error);
        toast({
          title: 'Partial Paste',
          description:
            'Nodes were added to the graph but the UI could not be fully updated.',
        });
        return { newNodesForFlow: [], newEdgesForFlow: [] };
      }
    },
    [reactFlowInstance, toast],
  );

  const selectNodesAndNotify = useCallback(
    (validNodeIds, totalNodeCount) => {
      requestAnimationFrame(() => {
        const reactFlowState = reactFlowInstance.toObject();

        const pastedFlowNodes = reactFlowState.nodes.filter((node) =>
          validNodeIds.has(node.id),
        );

        selectAddedNodes(pastedFlowNodes);

        toast({
          title: 'Pasted',
          description: `${pluralizeValue(pastedFlowNodes.length, 'node')} pasted${pastedFlowNodes.length !== totalNodeCount ? ' (some nodes could not be created)' : ''}`,
        });
      });
    },
    [reactFlowInstance, selectAddedNodes, toast],
  );

  const pasteFromClipboard = useCallback(async () => {
    if (!graphRef || pasteInProgressRef.current) return;
    pasteInProgressRef.current = true;

    try {
      const { sourceNodes, sourceEdges } = await parseClipboardData();

      if (!Array.isArray(sourceNodes) || !Array.isArray(sourceEdges)) {
        toast({
          title: 'Error',
          description: 'Invalid clipboard data',
        });
        return;
      }

      const offset = calculatePastePosition(sourceNodes);

      const { updatedGraphNodes, updatedEdges } = prepareNodesForPasting(
        sourceNodes,
        sourceEdges,
        offset,
      );

      const viewportState = reactFlowInstance.getViewport();
      const currentGraph = graphRef.getGraph();

      const validNodeIds = await addNodesToGraph(
        currentGraph,
        updatedGraphNodes,
      );
      addEdgesToGraph(currentGraph, updatedEdges, validNodeIds);

      const flow = graphRef.getFlow();
      if (flow) {
        updateFlowUI(
          flow,
          updatedGraphNodes,
          updatedEdges,
          validNodeIds,
          viewportState,
        );
        selectNodesAndNotify(validNodeIds, updatedGraphNodes.length);
      }
    } catch (error) {
      console.error('Paste error:', error);
      toast({
        title: 'Error',
        description: `Failed to paste: ${(error as Error).message}`,
      });
    } finally {
      pasteInProgressRef.current = false;
    }
  }, [
    addEdgesToGraph,
    addNodesToGraph,
    calculatePastePosition,
    graphRef,
    prepareNodesForPasting,
    reactFlowInstance,
    selectNodesAndNotify,
    toast,
    updateFlowUI,
  ]);

  return {
    copySelectedNodes,
    pasteFromClipboard,
  };
}

export default useCopyPaste;
