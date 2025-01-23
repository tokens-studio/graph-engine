import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema, createVariadicSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Multiply (Variadic)';
	static type = 'studio.tokens.math.multiplyVariadic';
	static description =
		'Multiply node allows you to multiply two or more numbers.';

	declare inputs: ToInput<{
		inputs: number[];
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('inputs', {
			type: {
				...createVariadicSchema(NumberSchema),
				default: []
			},
			variadic: true
		});
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const inputs = this.inputs.inputs.value;
		const output = inputs.reduce((acc, curr) => acc * curr, 1);
		this.outputs.value.set(output);
	}
}
