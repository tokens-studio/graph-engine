import {
	ISubgraphContainer,
	isSubgraphContainer
} from '@/programmatic/node.js';
import { Node } from '@/programmatic/node.js';
import { Output } from '@/programmatic/output.js';

type OutputValue<T> = T extends Output<infer U> ? U : never;

type UnwrapOutput<T> = {
	[K in keyof T]: OutputValue<T[K]>;
};

export const getAllOutputs = <T extends Node>(node: T) => {
	return Object.fromEntries(
		Object.entries(node.outputs).map(([key, value]) => [key, value.value])
	) as UnwrapOutput<T['outputs']>;
};

export function cloneSubgraphs(originalNode: Node, clonedNode: Node) {
	if (isSubgraphContainer(originalNode)) {
		const container = originalNode as ISubgraphContainer;
		const graphProperties = container.getGraphProperties();

		Object.entries(graphProperties).forEach(([key, graph]) => {
			if (graph && typeof graph.clone === 'function') {
				const clonedGraph = graph.clone();

				// assign the cloned graph to the corresponding property on the cloned node
				(clonedNode as any)[key] = clonedGraph;

				// ensure nodes within the cloned inner graph point back to the cloned graph
				Object.values(clonedGraph.nodes).forEach((node: any) => {
					if (typeof node.setGraph === 'function') {
						node.setGraph(clonedGraph);
					}
				});
			}
		});
	}
}
