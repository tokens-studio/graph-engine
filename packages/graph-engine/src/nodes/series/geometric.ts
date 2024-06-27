import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

type GeometricValue = {
	index: number;
	value: number;
};

export default class NodeDefinition extends Node {
	static title = 'Geometric Series';
	static type = 'studio.tokens.series.geometric';
	static description =
		'Generates a geometric series f(n)= c * (f(n-1)) of numbers based on the base value, steps down, steps and increment.';

	declare inputs: ToInput<{
		base: number;
		stepsDown: number;
		stepsUp: number;
		ratio: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
		indexed: GeometricValue[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('base', {
			type: {
				...NumberSchema,
				default: 16
			}
		});
		this.addInput('stepsDown', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('stepsUp', {
			type: {
				...NumberSchema,
				default: 1
			}
		});

		this.addInput('ratio', {
			type: {
				...NumberSchema,
				default: 1.5
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
				$id: `https://schemas.tokens.studio/studio.tokens.series.geometric/indexed.json`,
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
		const { base, precision, ratio, stepsDown, stepsUp } = this.getAllInputs();

		const values: GeometricValue[] = [];

		for (let i = 0 - stepsDown; i <= stepsUp; i++) {
			const value = setToPrecision(base * Math.pow(ratio, i), precision);
			values.push({
				index: i,
				value
			});
		}

		this.setOutput(
			'array',
			values.map(x => x.value)
		);
		this.setOutput('indexed', values);
	}
}
