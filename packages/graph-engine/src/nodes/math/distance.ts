import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends Node {
	static title = 'Distance';
	static type = 'studio.tokens.math.distance';
	static description = 'Calculates the absolute distance between two numbers';

	declare inputs: ToInput<{
		a: number;
		b: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		distance: number;
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
		this.addOutput('distance', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b, precision } = this.getAllInputs();
		const distance = Math.abs(a - b);
		this.outputs.distance.set(setToPrecision(distance, precision));
	}
}
