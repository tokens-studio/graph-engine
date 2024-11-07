import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

type PowerValue = {
	index: number;
	value: number;
};

export default class NodeDefinition extends Node {
	static title = 'Power Series';
	static type = 'studio.tokens.series.power';
	static description =
		'Generates sequence based on powers (e.g., 2⁰, 2¹, 2², 2³...)';

	declare inputs: ToInput<{
		base: number;
		startPower: number;
		endPower: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
		indexed: PowerValue[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('base', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.addInput('startPower', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('endPower', {
			type: {
				...NumberSchema,
				default: 3
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
				$id: `https://schemas.tokens.studio/studio.tokens.series.power/indexed.json`,
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
		const { base, startPower, endPower, precision } = this.getAllInputs();
		const values: PowerValue[] = [];

		for (let i = startPower; i <= endPower; i++) {
			const value = setToPrecision(Math.pow(base, i), precision);
			values.push({
				index: i,
				value
			});
		}

		this.outputs.array.set(values.map(x => x.value));
		this.outputs.indexed.set(values);
	}
}
