import { NodeDefinition, NodeTypes } from '../../types.js';

export const type = NodeTypes.MOD;

export const process = input => {
	return input.a % input.b;
};

export const node: NodeDefinition = {
	type,
	process
};
