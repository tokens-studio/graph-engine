import { Black, White, toColor, toColorObject } from './lib/utils.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ColorSpace, colorSpaces } from './lib/types.js';
import { Color as ColorType } from '../../types.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import Color from 'colorjs.io';

export default class NodeDefinition extends DataflowNode {
	static title = 'Mix Colors';
	static type = 'studio.tokens.color.mix';
	static description = 'Mixes two colors together';

	declare inputs: ToInput<{
		colorA: ColorType;
		colorB: ColorType;
		value: number;
		space: ColorSpace;
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
		this.dataflow.addInput('value', {
			type: {
				...NumberSchema,
				default: 0.5,
				description: 'Value to apply to the modifier'
			}
		});
		this.dataflow.addInput('space', {
			type: {
				...StringSchema,
				default: 'srgb',
				enum: Object.keys(colorSpaces),
				description: 'The color space we are operating in'
			}
		});

		this.dataflow.addOutput('value', {
			type: ColorSchema
		});
	}

	execute(): void | Promise<void> {
		const { colorA, space, value, colorB } = this.getAllInputs();

		const colA = toColor(colorA);
		const colB = toColor(colorB);

		colA.to(space);
		colB.to(space);

		const mixValue = Math.max(0, Math.min(1, Number(value)));

		const converted = Color.mix(colA, colB, mixValue);

		const final = toColorObject(converted);
		this.outputs.value.set(final);
	}
}
