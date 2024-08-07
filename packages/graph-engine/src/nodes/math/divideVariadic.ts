import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema, createVariadicSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Divide (Variadic)';
	static type = 'studio.tokens.math.divideVariadic';
	static description = 'Divide node allows you to divide two or more numbers.';

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
		const [start, ...rest] = this.inputs.inputs.value;
		const output = rest.reduce((acc, x) => acc / x, start);
		this.outputs.value.set(output);
	}
}
