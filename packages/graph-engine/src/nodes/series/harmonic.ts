import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

type HarmonicValue = {
	index: number;
	value: number;
};

export default class NodeDefinition extends DataflowNode {
	static title = 'Harmonic Series';
	static type = 'studio.tokens.series.harmonic';
	static description =
		'A "Harmonic Series" is a sequence of numbers whose reciprocals form an arithmetic progression. For example, in the series 1, 1/2, 1/3, 1/4, 1/5, the reciprocals form an arithmetic progression with common difference 1/6.';

	declare inputs: ToInput<{
		base: number;
		stepsDown: number;
		stepsUp: number;
		notes: number;
		ratio: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
		indexed: HarmonicValue[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('base', {
			type: {
				...NumberSchema,
				default: 16
			}
		});
		this.dataflow.addInput('stepsDown', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.dataflow.addInput('stepsUp', {
			type: {
				...NumberSchema,
				default: 5
			}
		});
		this.dataflow.addInput('notes', {
			type: {
				...NumberSchema,
				default: 5
			}
		});

		this.dataflow.addInput('ratio', {
			type: {
				...NumberSchema,
				default: 2
			}
		});

		this.dataflow.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.dataflow.addOutput('array', {
			type: arrayOf(NumberSchema)
		});
		this.dataflow.addOutput('indexed', {
			type: {
				$id: `https://schemas.tokens.studio/studio.tokens.series.harmonic/indexed.json`,
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
		const { base, precision, ratio, stepsDown, stepsUp, notes } =
			this.getAllInputs();

		const values: HarmonicValue[] = [];

		for (let i = 0 - stepsDown; i <= stepsUp; i++) {
			values.push({
				index: i,
				value: setToPrecision(base * Math.pow(ratio, i / notes), precision)
			});
		}

		this.outputs.array.set(values.map(x => x.value));
		this.outputs.indexed.set(values);
	}
}
