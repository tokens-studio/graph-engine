import { Edge, Graph, Node } from '@tokens-studio/graph-engine';

/**
 * Finds all nodes of a specified type in the graph
 * @param graph
 * @param type
 * @returns
 */
export const findNodesOfType = (graph: Graph, type: string) =>
	Object.values(graph.nodes).filter(node => node.factory.type === type);

export const findOutEdges = (graph: Graph, id: string) =>
	Object.values(graph.edges).filter(edge => edge.source === id);

/**
 * Converts the array of nodes in the graph to a lookup for O(1) performance
 * @param graph
 * @returns
 */
export const toNodeLookup = (graph: Graph): Record<string, Node> =>
	Object.values(graph.nodes).reduce((acc, node) => {
		acc[node.id] = node;
		return acc;
	}, {});

/**
 * Converts the array of edge in the graph to a lookup for O(1) performance
 * @param graph
 * @returns
 */
export const toEdgeLookup = (graph: Graph): Record<string, Edge> =>
	Object.values(graph.edges).reduce((acc, edge) => {
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
	graph: Graph,
	sourceType: string,
	targetType: string
): SourceToTarget[] => {
	const nodeLookup = toNodeLookup(graph);

	return Object.values(graph.nodes)
		.filter(node => node.factory.type === sourceType)
		.reduce((acc, node) => {
			const edges = findOutEdges(graph, node.id);

			const foundTargets = edges
				.filter(edge => nodeLookup[edge.target].factory.type === targetType)
				.map(edge => {
					return {
						source: node,
						edge,
						target: nodeLookup[edge.target]
					};
				});

			return acc.concat(foundTargets);
		}, []);
};
