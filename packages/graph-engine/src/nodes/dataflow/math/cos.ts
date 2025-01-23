import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Cosine';
	static type = 'studio.tokens.math.cos';
	static description = 'Cos node allows you to get the cosine of a number.';

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
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		this.outputs.value.set(Math.cos(this.inputs.value.value));
	}
}
