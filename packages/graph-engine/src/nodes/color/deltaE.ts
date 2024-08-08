import { Black, White, toColor } from './lib/utils.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../index.js';
import { setToPrecision } from '../../utils/precision.js';

export const algorithms = ['76', 'CMC', '2000', 'Jz', 'ITP', 'OK'] as const;

export type algorithm = (typeof algorithms)[number];

export default class NodeDefinition extends DataflowNode {
	static title = 'Delta E (ΔE)';
	static type = 'studio.tokens.color.deltaE';
	static description =
		'Delta E node allows you to calculate the distance between two colors.';

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('colorA', {
			type: {
				...ColorSchema,
				default: White
			}
		});
		this.dataflow.addInput('colorB', {
			type: {
				...ColorSchema,
				default: Black
			}
		});
		this.dataflow.addInput('precision', {
			type: {
				...NumberSchema,
				default: 4
			}
		});
		this.dataflow.addInput('algorithm', {
			type: {
				...StringSchema,
				enum: algorithms,
				default: '2000'
			}
		});

		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { colorA, colorB, algorithm, precision } = this.getAllInputs();

		const a = toColor(colorA);
		const b = toColor(colorB);

		const distance = a.deltaE(b, algorithm);

		this.outputs.value.set(setToPrecision(distance, precision));
	}
}
