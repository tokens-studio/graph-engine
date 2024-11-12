import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends Node {
	static title = 'Difference';
	static type = 'studio.tokens.math.difference';
	static description = 'Calculates the absolute difference between two numbers';

	declare inputs: ToInput<{
		a: number;
		b: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		difference: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('a', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('b', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2,
				minimum: 0
			}
		});
		this.addOutput('difference', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b, precision } = this.getAllInputs();
		const difference = Math.abs(a - b);
		this.outputs.difference.set(setToPrecision(difference, precision));
	}
}
