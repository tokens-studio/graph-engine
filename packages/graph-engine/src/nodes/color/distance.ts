import { Black, White, toColor } from './lib/utils.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { setToPrecision } from '../../utils/precision.js';

export const colorSpaces = ['Lab', 'ICtCp', 'Jzazbz'] as const;

export type ColorSpace = (typeof colorSpaces)[number];

export default class NodeDefinition extends DataflowNode {
	static title = 'Distance';
	static type = 'studio.tokens.color.distance';
	static description =
		'Calculate the distance between two colors. The output is a number representing the difference between the two colors. The lower the number, the closer the colors are to each other. The output is based on the CIEDE2000 color difference formula.';

	declare inputs: ToInput<{
		colorA: ColorType;
		colorB: ColorType;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		value: ColorType;
	}>;

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
		this.dataflow.addInput('space', {
			type: {
				...StringSchema,
				enum: colorSpaces,
				default: 'Lab'
			}
		});

		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { colorA, colorB, space, precision } = this.getAllInputs();

		const a = toColor(colorA);
		const b = toColor(colorB);

		const distance = a.distance(b, space);

		this.outputs.value.set(setToPrecision(distance, precision));
	}
}
