import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Square Root';
	static type = 'studio.tokens.math.sqrt';
	static description =
		'Calculates the square root of a number. This finds the value which, when multiplied by itself, equals the original number.';

	declare inputs: ToInput<{
		radicand: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('radicand', {
			type: NumberSchema
		});
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { radicand } = this.getAllInputs();
		this.outputs.value.set(Math.sqrt(radicand));
	}
}
