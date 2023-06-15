import { NodeDefinition, NodeTypes } from '../../types.js';

export const type = NodeTypes.ROUND;

export type Options = {
	value: number;
	precision: number;
	radix: number;
};

export const defaults: Options = {
	value: 0,
	precision: 0,
	radix: 1
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input: Options, state: Options) => {
	//Override with state if defined
	const final = {
		...state,
		...input
	};

	const shift = 10 ** final.precision;
	return Math.round(final.value * shift) / shift;
};

export const node: NodeDefinition<Options, Options> = {
	type,
	defaults,
	process
};
