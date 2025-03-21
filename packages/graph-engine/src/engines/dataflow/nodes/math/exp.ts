import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Exponentiation';
	static type = 'studio.tokens.math.exponent';
	static description =
		"Specifically calculates e (Euler's number, approximately 2.71828) raised to a power.";

	declare inputs: ToInput<{
		exponent: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('exponent', {
			type: NumberSchema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { exponent } = this.getAllInputs();
		this.outputs.value.set(Math.exp(exponent));
	}
}
