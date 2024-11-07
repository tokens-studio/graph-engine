import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

type FibonacciValue = {
	index: number;
	value: number;
};

export default class NodeDefinition extends Node {
	static title = 'Fibonacci Series';
	static type = 'studio.tokens.series.fibonacci';
	static description =
		'Generates the Fibonacci sequence where each number is the sum of the previous two numbers';

	declare inputs: ToInput<{
		length: number;
		startFirst: number;
		startSecond: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
		indexed: FibonacciValue[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('length', {
			type: {
				...NumberSchema,
				default: 8
			}
		});
		this.addInput('startFirst', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('startSecond', {
			type: {
				...NumberSchema,
				default: 1
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.addOutput('array', {
			type: arrayOf(NumberSchema)
		});
	}

	execute(): void | Promise<void> {
		const { length, startFirst, startSecond, precision } = this.getAllInputs();
		const values: FibonacciValue[] = [];

		if (length <= 0) {
			this.outputs.array.set([]);
			return;
		}

		// Add first term
		values.push({
			index: 0,
			value: setToPrecision(startFirst, precision)
		});

		if (length === 1) {
			this.outputs.array.set(values.map(x => x.value));
			return;
		}

		// Add second term
		values.push({
			index: 1,
			value: setToPrecision(startSecond, precision)
		});

		// Generate remaining length
		for (let i = 2; i < length; i++) {
			const nextValue = values[i - 1].value + values[i - 2].value;
			values.push({
				index: i,
				value: setToPrecision(nextValue, precision)
			});
		}

		this.outputs.array.set(values.map(x => x.value));
	}
}
