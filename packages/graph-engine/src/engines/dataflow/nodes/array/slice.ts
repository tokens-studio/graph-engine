import { AnyArraySchema, NumberSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Slice Array';
	static type = 'studio.tokens.array.slice';
	static description = 'Slices an input array';

	declare inputs: ToInput<{
		array: T[];
		start: number;
		end: number;
	}>;
	declare outputs: ToOutput<{
		value: T[];
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('array', {
			type: AnyArraySchema
		});
		this.dataflow.addInput('start', {
			type: NumberSchema
		});
		this.dataflow.addInput('end', {
			type: NumberSchema
		});
		this.dataflow.addOutput('value', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const { start, end } = this.getAllInputs();
		const array = this.inputs.array;
		const calculated = array.value.slice(start, end);

		this.outputs.value.set(calculated, array.type);
	}
}
