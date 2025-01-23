import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { arrayOf } from '../../../schemas/utils.js';
import { setToPrecision } from '../../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Alternating Series';
	static type = 'studio.tokens.series.alternating';
	static description =
		'Generates a sequence that alternates between positive and negative values based on a pattern';

	declare inputs: ToInput<{
		sequence: number[];
		pattern: number[];
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('sequence', {
			type: {
				...arrayOf(NumberSchema),
				default: [1, 2, 3, 4]
			}
		});
		this.addInput('pattern', {
			type: {
				...arrayOf(NumberSchema),
				default: [1, -1] // Default alternating pattern
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
		const { sequence, pattern, precision } = this.getAllInputs();
		const values: number[] = new Array(sequence.length).fill(0);

		// Create a new variable for the pattern to use
		const patternToUse = pattern.length === 0 ? [1] : pattern;

		sequence.forEach((num, i) => {
			const patternIndex = i % patternToUse.length;
			const patternValue = patternToUse[patternIndex];
			const value = setToPrecision(num * patternValue, precision);
			values[i] = value;
		});

		this.outputs.array.set(values);
	}
}
