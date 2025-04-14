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

export function cloneInnerGraph(originalNode: Node, clonedNode: Node) {
	const original = originalNode as any;
	const cloned = clonedNode as any;

	if (
		original._innerGraph &&
		typeof original._innerGraph.clone === 'function'
	) {
		cloned._innerGraph = original._innerGraph.clone();

		// ensure nodes within the cloned inner graph point to it
		Object.values(cloned._innerGraph.nodes).forEach((node: any) => {
			if (typeof node.setGraph === 'function') {
				node.setGraph(cloned._innerGraph);
			}
		});
	}
}
