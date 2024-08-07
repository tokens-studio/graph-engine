import { Graph } from '@/graph/graph.js';
import { Node, Port } from '@/programmatic/index.js';
import { SerializedGraph } from '@/graph/types.js';
import { dedupe } from './dedupe.js';

/**
 * Extracts the nodes types from a serialized graph
 * @param graph
 */
export const extractTypes = (graph: SerializedGraph): string[] => {
	return Object.values(graph.nodes.map(x => x.type));
};

export const hasConnectedInput = (
	graph: Graph,
	source: Node,
	input: Port
): boolean => {
	const edges = graph.inEdges(source.id);

	return edges.some(x => x.targetHandle === input.name);
};

/**
 * Returns the Nodes of the node that are immediate predecessors of the given node O(m) the amount of edges
 * @param nodeId
 * @returns
 */
export const predecessors = (graph: Graph, nodeId: string): Node[] => {
	//Lookup the node
	const node = graph.nodes[nodeId];
	if (!node) {
		return [];
	}
	//Lookup the incoming edges

	//This returns all edge ids that target this node
	const out = Object.values(graph.edges).reduce((acc, x) => {
		if (x.target === nodeId) {
			acc.push(x.source);
		}
		return acc;
	}, [] as string[]);

	return dedupe(out).map(x => graph.nodes[x]);
};

export const injectCapabilities = (old: Graph, newGraph: Graph) => {
	old.registeredCapabilities.forEach(capability =>
		newGraph.registerCapability(capability)
	);
};
