import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends Node {
	static title = 'Exponential Decay';
	static type = 'studio.tokens.series.exponentialDecay';
	static description =
		'Generates a sequence using exponential decay formula: P*e^(-kx)';

	declare inputs: ToInput<{
		initialValue: number;
		length: number;
		decayRate: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		values: number[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('initialValue', {
			type: {
				...NumberSchema,
				default: 100,
				description: 'Initial value (P)'
			}
		});
		this.addInput('length', {
			type: {
				...NumberSchema,
				default: 5,
				minimum: 1,
				description: 'Number of values to generate'
			}
		});
		this.addInput('decayRate', {
			type: {
				...NumberSchema,
				default: 0.5,
				minimum: 0,
				description: 'Decay rate constant (k)'
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2,
				minimum: 0
			}
		});
		this.addOutput('values', {
			type: arrayOf(NumberSchema)
		});
	}

	execute(): void | Promise<void> {
		const { initialValue, length, decayRate, precision } = this.getAllInputs();

		const values = Array.from({ length }, (_, i) =>
			setToPrecision(initialValue * Math.exp(-decayRate * i), precision)
		);

		this.outputs.values.set(values);
	}
}
