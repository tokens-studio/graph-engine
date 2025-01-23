import { Node } from '@/programmatic/nodes/node.js';
import { Output } from '@/programmatic/dataflow/output.js';

type OutputValue<T> = T extends Output<infer U> ? U : never;

type UnwrapOutput<T> = {
	[K in keyof T]: OutputValue<T[K]>;
};

export const getAllOutputs = <T extends Node>(node: T) => {
	return Object.fromEntries(
		Object.entries(node.outputs).map(([key, value]) => [
			key,
			(value as Output).value
		])
	) as UnwrapOutput<T['outputs']>;
};
