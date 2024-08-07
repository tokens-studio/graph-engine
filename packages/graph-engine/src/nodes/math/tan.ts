import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Tan';
	static type = 'studio.tokens.math.tan';
	static description = 'Tan node allows you to get the sin of a number.';

	declare inputs: ToInput<{
		value: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('value', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const value = this.inputs.value.value;
		this.outputs.value.set(Math.tan(value));
	}
}
