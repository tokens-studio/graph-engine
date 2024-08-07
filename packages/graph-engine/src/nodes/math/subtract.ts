import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Subtract';
	static type = 'studio.tokens.math.subtract';
	static description = 'Allows you to subtract two numbers.';

	declare inputs: ToInput<{
		a: number;
		b: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('a', {
			type: NumberSchema
		});
		this.dataflow.addInput('b', {
			type: NumberSchema
		});
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b } = this.getAllInputs();
		this.outputs.value.set(a - b);
	}
}
