import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Power';
	static type = 'studio.tokens.math.pow';
	static description =
		'Power node allows you to Raises a base number to the power of an exponent.';

	declare inputs: ToInput<{
		base: number;
		exponent: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('base', {
			type: NumberSchema
		});
		this.dataflow.addInput('exponent', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { base, exponent } = this.getAllInputs();
		this.outputs.value.set(Math.pow(base, exponent));
	}
}
