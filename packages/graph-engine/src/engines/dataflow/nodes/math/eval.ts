import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition } from '../../programmatic/nodes/node.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';
import { Parser } from 'expr-eval';
import { ToInput } from '../../programmatic/dataflow/input.js';
import { ToOutput } from '../../programmatic/dataflow/output.js';
import { annotatedDynamicInputs } from '../../annotations/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Evaluate math';
	static type = 'studio.tokens.math.eval';
	static description = 'Allows you to evaluate arbitrary math expressions';

	declare inputs: ToInput<{
		expression: string;
	}> &
		ToInput<{
			[key: string]: number;
		}>;

	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.annotations[annotatedDynamicInputs] = true;
		this.addInput('expression', {
			type: StringSchema
		});

		//We expect users to expose the variables they want to use in the expression as inputs

		this.addOutput('value', {
			type: NumberSchema
		});
		this.addOutput('expression', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { expression, ...inputs } = this.getAllInputs();
		const parser = new Parser();

		const output = parser.evaluate(expression, inputs);

		this.outputs.expression.set(expression);
		this.outputs.value.set(output);
	}
}
