import { AnyArraySchema, AnySchema } from '../../schemas/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Array push';
	static type = 'studio.tokens.array.push';
	static description = 'Pushes an item to an array and returns the new array.';

	declare inputs: ToInput<{
		/**
		 * The array to push to
		 */
		array: T[];
		/**
		 * The item to push to the array
		 */
		item: T;
	}>;
	declare outputs: ToOutput<{
		/**
		 * The array with the item pushed to it
		 */
		value: T[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('array', {
			type: AnyArraySchema
		});
		this.dataflow.addInput('item', {
			type: AnySchema
		});
		this.dataflow.addOutput('value', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const { item } = this.getAllInputs();
		const array = this.inputs.array;
		const calculated = [...array.value, item];

		this.outputs.value.set(calculated, array.type);
	}
}
