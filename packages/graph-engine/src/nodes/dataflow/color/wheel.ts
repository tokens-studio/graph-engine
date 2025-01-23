import { ColorSchema, NumberSchema } from '../../../schemas/index.js';
import { Color as ColorType } from '../../../types.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../../index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { arrayOf } from '../../../schemas/utils.js';
import { toColorObject } from './lib/utils.js';
import Color from 'colorjs.io';

export default class NodeDefinition extends DataflowNode {
	static title = 'Color Wheel';
	static type = 'studio.tokens.color.wheel';
	static description =
		'Generate Color Wheel node allows you to create a color scale based on a base color and rotation in hue. You can use this node to generate a color scale for a specific color property.';
	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('baseHue', {
			type: {
				...NumberSchema,
				default: 360
			}
		});
		this.addInput('angle', {
			type: {
				...NumberSchema,
				default: 180
			}
		});
		this.addInput('saturation', {
			type: {
				...NumberSchema,
				default: 80
			}
		});
		this.addInput('lightness', {
			type: {
				...NumberSchema,
				default: 80
			}
		});
		this.addInput('colors', {
			type: {
				...NumberSchema,
				default: 8
			}
		});

		this.dataflow.addOutput('value', {
			type: arrayOf(ColorSchema)
		});
	}

	declare inputs: ToInput<{
		baseHue: number;
		angle: number;
		saturation: number;
		lightness: number;
		colors: number;
	}>;
	declare outputs: ToOutput<{
		value: ColorType[];
	}>;

	execute(): void | Promise<void> {
		const { colors, baseHue, angle, saturation, lightness } =
			this.getAllInputs();

		const colorList: ColorType[] = [];

		for (let step = 0; step < colors; step++) {
			// Hue Calculation
			const hueIncrement = colors > 1 ? (angle / (colors - 1)) * step : 0;
			const hue = (baseHue + hueIncrement) % 360;

			// Color Generation with colorjs.io
			const color = new Color('hsl', [hue, saturation, lightness]);

			colorList.push(toColorObject(color));
		}

		this.outputs.value.set(colorList);
	}
}
