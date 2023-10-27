import { Edge, FlowGraph, Node } from "@tokens-studio/graph-engine";

/**
 * Finds all nodes of a specified type in the graph
 * @param graph
 * @param type
 * @returns
 */
export const findNodesOfType = (graph: FlowGraph, type: string) =>
  graph.nodes.filter((node) => node.type === type);

export const findOutEdges = (graph: FlowGraph, id: string) =>
  graph.edges.filter((edge) => edge.source === id);

/**
 * Converts the array of nodes in the graph to a lookup for O(1) performance
 * @param graph
 * @returns
 */
export const toNodeLookup = (graph: FlowGraph): Record<string, Node> =>
  graph.nodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

/**
 * Converts the array of edge in the graph to a lookup for O(1) performance
 * @param graph
 * @returns
 */
export const toEdgeLookup = (graph: FlowGraph): Record<string, Edge> =>
  graph.edges.reduce((acc, edge) => {
    acc[edge.id] = edge;
    return acc;
  }, {});

export type SourceToTarget = {
  source: Node;
  edge: Edge;
  target: Node;
};

/**
 * Finds all nodes in the graph that have a specified source and have and edge connecting to the target
 * @param graph
 * @param sourceType
 * @param target
 * @returns
 */
export const findSourceToTargetOfType = (
  graph: FlowGraph,
  sourceType: string,
  targetType: string
): SourceToTarget[] => {
  const nodeLookup = toNodeLookup(graph);

  return graph.nodes
    .filter((node) => node.type === sourceType)
    .reduce((acc, node) => {
      const edges = findOutEdges(graph, node.id);

      const foundTargets = edges
        .filter((edge) => nodeLookup[edge.target].type === targetType)
        .map((edge) => {
          return {
            source: node,
            edge,
            target: nodeLookup[edge.target],
          };
        });

      return acc.concat(foundTargets);
    }, []);
};
