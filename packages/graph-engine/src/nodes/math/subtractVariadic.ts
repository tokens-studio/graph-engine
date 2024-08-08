import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema, createVariadicSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Subtract (Variadic)';
	static type = 'studio.tokens.math.subtractVariadic';
	static description = 'Allows you to subtract two or more numbers.';

	declare inputs: ToInput<{
		inputs: number[];
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('inputs', {
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
		const [start, ...rest] = inputs;
		const output = rest.reduce((acc, x) => acc - x, start);
		this.outputs.value.set(output);
	}
}
