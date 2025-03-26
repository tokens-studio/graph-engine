import {
  Node as GraphNode,
  NodeFactory,
  SerializedEdge,
} from '@tokens-studio/graph-engine';
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

type EdgesByTargetMap = Record<string, Array<SerializedEdge>>;

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

  const calculateBoundingBox = useCallback((nodes) => {
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
  }, []);

  const parseClipboardData = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const { nodes: sourceNodes, edges: sourceEdges } = JSON.parse(text);
      return { sourceNodes, sourceEdges };
    } catch (error) {
      console.error('Error parsing clipboard data:', error);
      throw new Error('Invalid clipboard data');
    }
  }, []);

  const updateNodeIdsRecursively = useCallback((node, idMapping) => {
    const newId = uuidv4();
    idMapping.set(node.id, newId);

    const updatedNode = {
      ...node,
      id: newId,
    };

    // process inner graph if it exists
    if (node.innergraph && Array.isArray(node.innergraph.nodes)) {
      const innerIdMapping = new Map();

      updatedNode.innergraph = {
        ...node.innergraph,
        nodes: node.innergraph.nodes.map((innerNode) =>
          updateNodeIdsRecursively(innerNode, innerIdMapping),
        ),
        edges: Array.isArray(node.innergraph.edges)
          ? node.innergraph.edges.map((edge) => ({
              ...edge,
              id: uuidv4(),
              source: innerIdMapping.get(edge.source) || edge.source,
              target: innerIdMapping.get(edge.target) || edge.target,
            }))
          : [],
      };

      // update inner graph ID if it exists
      if (node.innergraph.annotations?.['engine.id']) {
        updatedNode.innergraph.annotations = {
          ...node.innergraph.annotations,
          'engine.id': uuidv4(),
        };
      }
    }

    return updatedNode;
  }, []);

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
      return {
        x: viewportCenter.x - (pasteBounds.minX + pasteBounds.maxX) / 2,
        y: viewportCenter.y - (pasteBounds.minY + pasteBounds.maxY) / 2,
      };
    },
    [reactFlowInstance, calculateBoundingBox],
  );

  const copySelectedNodes = useCallback(() => {
    if (!graphRef) return;

    const flow = graphRef.getFlow();
    const graph = graphRef.getGraph();
    const selectedNodes = flow.getNodes().filter((node) => node.selected);
    const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));

    if (selectedNodeIds.size === 0) {
      return;
    }

    // create a subgraph with only the selected nodes
    const subGraph = graph.serialize();
    subGraph.nodes = subGraph.nodes.filter((node) =>
      selectedNodeIds.has(node.id),
    );

    // filter and prepare edges
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
        annotations: { ...edge.annotations },
      }));

    // remove viewport from annotations
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { 'ui.viewport': _, ...restAnnotations } = subGraph.annotations;
    subGraph.annotations = restAnnotations;

    // serialize and copy to clipboard
    const serialized = JSON.stringify(subGraph);
    navigator.clipboard
      .writeText(serialized)
      .then(() => {
        toast({
          title: 'Copied',
          description: `${pluralizeValue(
            selectedNodes.length,
            'node',
          )} copied to clipboard`,
        });
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: `Failed to copy: ${(error as Error).message}`,
        });
      });
  }, [graphRef, toast]);

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
          annotations: { ...edge.annotations },
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
          const existingNodes = (
            Object.values(graph.nodes) as GraphNode[]
          ).filter((existingNode) => existingNode.factory.type === node.type);

          // skip pasting this node if one of its type already exists
          if (existingNodes.length > 0) {
            console.warn(`Singleton node of type ${node.type} already exists`);
            return null;
          }
        }

        const factory = fullNodeLookup[node.type];
        if (!factory) return null;

        try {
          const newNode = await factory.deserialize({
            serialized: node,
            graph,
            lookup: fullNodeLookup,
          });

          // initialize node by executing it
          await newNode.execute();

          // only update non-variadic nodes now; variadic nodes will be updated after connections
          // @ts-ignore - the port's variadic property exists but isn't typed
          const hasVariadicInputs = Object.values(newNode.inputs).some(
            (input) => input.variadic,
          );
          if (!hasVariadicInputs) {
            try {
              await graph.update(newNode.id);
            } catch (updateError) {
              console.error(
                `Error updating node ${node.type} after deserialization:`,
                updateError,
              );
            }
          }

          return node.id;
        } catch (error) {
          console.error(`Error creating node ${node.type}:`, error);
          return null;
        }
      });

      const addedNodeIds = await Promise.all(singletonChecks);
      return new Set(addedNodeIds.filter(Boolean));
    },
    [fullNodeLookup],
  );

  const createVariadicEdges = useCallback(
    async (graph, targetNode, targetPort, edges, edgeIdMap) => {
      // sort edges by their variadic index
      const sortedEdges = [...edges].sort((a, b) => {
        const indexA = a.annotations?.['engine.index'] ?? 999;
        const indexB = b.annotations?.['engine.index'] ?? 999;
        return indexA - indexB;
      });

      // remove any existing connections and reset port
      for (const existingEdge of [...targetPort._edges]) {
        graph.removeEdge(existingEdge.id);
      }

      targetPort.reset();

      // add new connections in order
      for (const [idx, edge] of sortedEdges.entries()) {
        try {
          const sourceNode = graph.getNode(edge.source);
          const sourcePort = sourceNode?.outputs[edge.sourceHandle];

          if (sourceNode && sourcePort) {
            const variadicIndex =
              edge.annotations?.['engine.index'] !== undefined
                ? edge.annotations['engine.index']
                : idx;

            const newEdge = graph.connect(
              sourceNode,
              sourcePort,
              targetNode,
              targetPort,
              variadicIndex,
            );

            edgeIdMap.set(edge.id, newEdge.id);
          }
        } catch (error) {
          console.error(`Error creating variadic edge at index ${idx}:`, error);
        }
      }
    },
    [],
  );

  const createStaticEdge = useCallback(
    async (graph, targetNode, targetPort, edge, edgeIdMap) => {
      try {
        const sourceNode = graph.getNode(edge.source);
        const sourcePort = sourceNode?.outputs[edge.sourceHandle];

        if (sourceNode && sourcePort) {
          const newEdge = graph.connect(
            sourceNode,
            sourcePort,
            targetNode,
            targetPort,
          );

          edgeIdMap.set(edge.id, newEdge.id);
        }
      } catch (error) {
        console.error('Error creating edge:', error);
      }
    },
    [],
  );

  const createEdgesForPastedNodes = useCallback(
    async (graph, updatedEdges, validNodeIds) => {
      const newEdgeIdsMap = new Map();
      const edgesByTarget: EdgesByTargetMap = {};

      // group edges by target node and port
      for (const edge of updatedEdges) {
        if (validNodeIds.has(edge.source) && validNodeIds.has(edge.target)) {
          const key = `${edge.target}:${edge.targetHandle}`;
          if (!edgesByTarget[key]) edgesByTarget[key] = [];
          edgesByTarget[key].push(edge);
        }
      }

      // create edges in the graph
      for (const [key, groupEdges] of Object.entries(edgesByTarget)) {
        const [targetId, targetHandle] = key.split(':');
        const targetNode = graph.getNode(targetId);
        const targetPort = targetNode?.inputs[targetHandle];

        if (!targetNode || !targetPort) continue;

        if (targetPort.variadic) {
          await createVariadicEdges(
            graph,
            targetNode,
            targetPort,
            groupEdges,
            newEdgeIdsMap,
          );
        } else {
          await createStaticEdge(
            graph,
            targetNode,
            targetPort,
            groupEdges[0],
            newEdgeIdsMap,
          );
        }
      }

      return newEdgeIdsMap;
    },
    [createStaticEdge, createVariadicEdges],
  );

  const executeNodesInOrder = useCallback(async (graph, validNodeIds) => {
    const executedNodes = new Set<string>();

    // find nodes with variadic inputs
    const variadicNodes = [...validNodeIds].filter((id) => {
      const node = graph.getNode(id as string);
      // @ts-ignore - The port's variadic property exists but isn't typed
      return node && Object.values(node.inputs).some((input) => input.variadic);
    });

    // execute all variadic nodes
    const variadicPromises = variadicNodes.map(async (nodeId) => {
      executedNodes.add(nodeId as string);
      try {
        await graph.update(nodeId as string);
      } catch (error) {
        console.error(`Error executing variadic node ${nodeId}:`, error);
      }
    });
    await Promise.all(variadicPromises);

    // find direct dependencies of variadic nodes
    const directDependencies = new Set<string>();
    for (const nodeId of variadicNodes) {
      const outEdges = graph.outEdges(nodeId as string);
      for (const edge of outEdges) {
        if (validNodeIds.has(edge.target) && !executedNodes.has(edge.target)) {
          directDependencies.add(edge.target);
        }
      }
    }

    // execute all direct dependencies
    const dependencyPromises = [...directDependencies].map(async (nodeId) => {
      executedNodes.add(nodeId);
      try {
        await graph.update(nodeId);
      } catch (error) {
        console.error(`Error executing dependency node ${nodeId}:`, error);
      }
    });
    await Promise.all(dependencyPromises);

    // execute all remaining nodes
    const remainingNodes = [...validNodeIds].filter(
      (nodeId) => !executedNodes.has(nodeId as string),
    );
    const remainingPromises = remainingNodes.map(async (nodeId) => {
      try {
        await graph.update(nodeId as string);
      } catch (error) {
        console.error(`Error executing node ${nodeId}:`, error);
      }
    });
    await Promise.all(remainingPromises);
  }, []);

  const updateFlowUI = useCallback(
    (flow, nodes, edges, validNodeIds, viewportState) => {
      try {
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

        const newEdgesForFlow = edges
          .filter(
            (edge) =>
              validNodeIds.has(edge.source) && validNodeIds.has(edge.target),
          )
          .map((edge) => {
            const variadicIndex = edge.annotations?.['engine.index'];
            let targetHandle = edge.targetHandle;

            // if it's a variadic edge, add the index to the targetHandle for the UI
            if (variadicIndex !== undefined) {
              targetHandle = `${edge.targetHandle}[${variadicIndex}]`;
            }

            return {
              ...edge,
              targetHandle,
              type: 'custom',
            };
          });

        flow.addNodes(newNodesForFlow);
        flow.addEdges(newEdgesForFlow);

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

        const successfulCount = pastedFlowNodes.length;
        const partialMessage =
          successfulCount !== totalNodeCount
            ? ' (some nodes could not be created)'
            : '';

        toast({
          title: 'Pasted',
          description: `${pluralizeValue(
            successfulCount,
            'node',
          )} pasted${partialMessage}`,
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
        console.error('Invalid clipboard data');
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

      const newEdgeIdsMap = await createEdgesForPastedNodes(
        currentGraph,
        updatedEdges,
        validNodeIds,
      );

      await executeNodesInOrder(currentGraph, validNodeIds);

      const flow = graphRef.getFlow();
      if (flow) {
        // create a version of updatedEdges with new IDs
        const updatedEdgesWithNewIds = updatedEdges.map((edge) => {
          const newId = newEdgeIdsMap.get(edge.id);
          if (newId) {
            return { ...edge, id: newId };
          }
          return edge;
        });

        updateFlowUI(
          flow,
          updatedGraphNodes,
          updatedEdgesWithNewIds,
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
    graphRef,
    parseClipboardData,
    calculatePastePosition,
    prepareNodesForPasting,
    reactFlowInstance,
    addNodesToGraph,
    createEdgesForPastedNodes,
    executeNodesInOrder,
    updateFlowUI,
    selectNodesAndNotify,
    toast,
  ]);

  return {
    copySelectedNodes,
    pasteFromClipboard,
  };
}

export default useCopyPaste;
