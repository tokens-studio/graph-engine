import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

type AlternatingValue = {
	index: number;
	value: number;
};

export default class NodeDefinition extends Node {
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
		indexed: AlternatingValue[];
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
		this.addOutput('indexed', {
			type: {
				$id: `https://schemas.tokens.studio/studio.tokens.series.alternating/indexed.json`,
				type: 'object',
				properties: {
					index: {
						type: NumberSchema
					},
					value: {
						type: NumberSchema
					}
				}
			},
			visible: false
		});
	}

	execute(): void | Promise<void> {
		const { sequence, pattern, precision } = this.getAllInputs();
		const values: AlternatingValue[] = [];

		// Create a new variable for the pattern to use
		const patternToUse = pattern.length === 0 ? [1] : pattern;

		sequence.forEach((num, i) => {
			const patternValue = patternToUse[i % patternToUse.length];
			const value = setToPrecision(num * patternValue, precision);
			values.push({
				index: i,
				value
			});
		});

		this.outputs.array.set(values.map(x => x.value));
		this.outputs.indexed.set(values);
	}
}
