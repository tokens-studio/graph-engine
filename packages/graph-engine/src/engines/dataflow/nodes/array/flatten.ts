import { AnyArraySchema } from '../../schemas/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Array flatten';
	static type = 'studio.tokens.array.flatten';
	static description = 'Flattens an array of arrays into a single array.';

	declare inputs: ToInput<{
		/**
		 * The array to push to
		 */
		array: T[][];
	}>;
	declare outputs: ToOutput<{
		/**
		 * The array with the item pushed to it
		 */
		array: T[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('array', {
			type: AnyArraySchema
		});
		this.dataflow.addOutput('array', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const array = this.inputs.array;

		//Attempt to determine the type of the array
		const type = array.type.items;

		if (type.type !== 'array') {
			throw new Error('Input array must be an array of arrays');
		}

		const calculated = array.value.flat();
		this.outputs.array.set(calculated, type);
	}
}
