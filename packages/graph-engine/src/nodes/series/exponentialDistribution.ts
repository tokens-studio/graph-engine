import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends Node {
	static title = 'Exponential Distribution';
	static type = 'studio.tokens.series.exponentialDistribution';
	static description =
		'Distributes a value across an array using exponential decay';

	declare inputs: ToInput<{
		value: number;
		length: number;
		decay: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		values: number[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: {
				...NumberSchema,
				default: 100
			}
		});
		this.addInput('length', {
			type: {
				...NumberSchema,
				default: 5,
				minimum: 1
			}
		});
		this.addInput('decay', {
			type: {
				...NumberSchema,
				default: 0.5,
				minimum: 0
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
		const { value, length, decay, precision } = this.getAllInputs();

		// Calculate weights using exponential decay
		const weights = Array.from({ length: length }, (_, i) =>
			Math.exp(-decay * i)
		);

		// Calculate total weight for normalization
		const totalWeight = weights.reduce((sum, w) => sum + w, 0);

		// Calculate distributed values
		const distributedValues = weights.map(weight =>
			setToPrecision((weight / totalWeight) * value, precision)
		);

		this.outputs.values.set(distributedValues);
	}
}
