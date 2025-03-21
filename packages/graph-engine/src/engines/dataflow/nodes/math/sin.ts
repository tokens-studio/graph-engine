import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Sine';
	static type = 'studio.tokens.math.sin';
	static description = 'Sin node allows you to get the sin of a number.';

	declare inputs: ToInput<{
		value: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const value = this.inputs.value.value;
		this.outputs.value.set(Math.sin(value));
	}
}
