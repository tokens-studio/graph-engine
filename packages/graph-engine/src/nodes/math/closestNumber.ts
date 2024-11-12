import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';

export default class NodeDefinition extends Node {
	static title = 'Closest Number';
	static type = 'studio.tokens.math.closestNumber';
	static description = 'Finds the closest number in an array to a target value';

	declare inputs: ToInput<{
		numbers: number[];
		target: number;
	}>;

	declare outputs: ToOutput<{
		index: number;
		value: number;
		difference: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('numbers', {
			type: {
				...arrayOf(NumberSchema),
				default: [1, 2, 3],
				description: 'Array of numbers to search through'
			}
		});
		this.addInput('target', {
			type: {
				...NumberSchema,
				default: 2,
				description: 'Target number to find closest match for'
			}
		});

		this.addOutput('index', {
			type: {
				...NumberSchema,
				description: 'Index of the closest number'
			}
		});
		this.addOutput('value', {
			type: {
				...NumberSchema,
				description: 'The closest number found'
			}
		});
		this.addOutput('difference', {
			type: {
				...NumberSchema,
				description: 'Absolute difference between target and closest number'
			}
		});
	}

	execute(): void | Promise<void> {
		const { numbers, target } = this.getAllInputs();

		if (!numbers || numbers.length === 0) {
			throw new Error('Input array cannot be empty');
		}

		const result = numbers.reduce(
			(acc, curr, idx) => {
				const difference = target - curr;
				if (Math.abs(difference) < Math.abs(acc.difference)) {
					return { index: idx, value: curr, difference };
				}
				return acc;
			},
			{
				index: 0,
				value: numbers[0],
				difference: target - numbers[0]
			}
		);

		this.outputs.index.set(result.index);
		this.outputs.value.set(result.value);
		this.outputs.difference.set(result.difference);
	}
}
