import { AnySchema, BooleanSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';

export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Logical Not';
	static type = 'studio.tokens.logic.not';
	static description = 'Not node allows you to negate a boolean value.';

	declare inputs: ToInput<{
		value: T;
	}>;

	declare outputs: ToOutput<{
		value: boolean;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('value', {
			type: AnySchema
		});
		this.dataflow.addOutput('value', {
			type: BooleanSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();

		this.outputs.value.set(!value);
	}
}
