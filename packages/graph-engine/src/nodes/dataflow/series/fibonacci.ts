// import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { arrayOf } from '../../../schemas/utils.js';
import { setToPrecision } from '../../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
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
	}>;

	constructor(props) {
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
		const values: number[] = new Array(length).fill(0);

		if (length <= 0) {
			this.outputs.array.set([]);
			return;
		}

		// Add first term
		values[0] = setToPrecision(startFirst, precision);

		if (length === 1) {
			this.outputs.array.set(values);
			return;
		}

		// Add second term
		values[1] = setToPrecision(startSecond, precision);

		// Generate remaining length
		for (let i = 2; i < length; i++) {
			const nextValue = values[i - 1] + values[i - 2];
			values[i] = setToPrecision(nextValue, precision);
		}

		this.outputs.array.set(values);
	}
}
