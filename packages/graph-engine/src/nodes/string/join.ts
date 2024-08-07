import { AnyArraySchema, StringSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Join Array';
	static type = 'studio.tokens.string.join';

	declare inputs: ToInput<{
		array: T[];
		delimiter: string;
	}>;

	declare outputs: ToOutput<{
		value: string;
	}>;

	static description =
		'Join node allows you to join an array into a string using a delimiter.';
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('array', {
			type: AnyArraySchema
		});
		this.dataflow.addInput('delimiter', {
			type: {
				...StringSchema,
				default: '-'
			}
		});
		this.dataflow.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { delimiter, array } = this.getAllInputs();
		this.outputs.value.set(array.join(delimiter));
	}
}
