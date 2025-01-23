import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Clamp';
	static type = 'studio.tokens.math.clamp';
	static description =
		'Clamp node allows you to restricts a value within a specified minimum and maximum range.';

	declare inputs: ToInput<{
		value: number;
		min: number;
		max: number;
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
		this.addInput('min', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('max', {
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
		const { value, min, max } = this.getAllInputs();
		this.outputs.value.set(value > max ? max : value < min ? min : value);
	}
}
