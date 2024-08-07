import { AnySchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
export default class NodeDefinition extends DataflowNode {
	static title = 'Assert defined';
	static type = 'studio.tokens.typing.assertDefined';
	static description = 'Asserts that a value is defined';

	declare inputs: ToInput<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any;
	}>;
	declare outputs: ToOutput<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('value', {
			type: AnySchema
		});
		this.dataflow.addOutput('value', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const value = this.inputs.value;
		if (value.value === undefined) {
			throw new Error('Value is required');
		}
		this.outputs.value.set(value, value.type);
	}
}
