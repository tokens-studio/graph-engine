import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';

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
		this.dataflow.addInput('value', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.dataflow.addInput('min', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.dataflow.addInput('max', {
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
