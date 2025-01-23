import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Ceil';
	static type = 'studio.tokens.math.ceil';
	static description =
		'Ceil node allows you to adjusts a floating-point number to the nearest higher integer.';

	declare inputs: ToInput<{
		value: number;
	}>;

	declare outputs: ToOutput<{
		value: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: NumberSchema
		});

		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();

		this.outputs.value.set(Math.ceil(value));
	}
}
