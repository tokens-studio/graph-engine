import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

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
		this.addInput('a', {
			type: NumberSchema
		});
		this.addInput('b', {
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
