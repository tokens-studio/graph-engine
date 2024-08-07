import { AnyArraySchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Reverse Array';
	static type = 'studio.tokens.array.reverse';
	static description = 'Reverses a given array without mutating the original';

	declare inputs: ToInput<{
		array: T[];
	}>;
	declare outputs: ToOutput<{
		value: T[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('array', {
			type: AnyArraySchema
		});
		this.dataflow.addOutput('value', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const array = this.inputs.array;
		//Normal reverse mutates the array. We don't want that.
		const reversed = [...array.value].reverse();

		this.outputs.value.set(reversed, array.type);
	}
}
