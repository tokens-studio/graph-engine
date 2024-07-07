import { ColorSchema, NumberSchema } from '../../schemas/index.js';
import { ColorSpace } from './lib/types.js';
import { Color as ColorType } from '../../types.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { White, toColor, toColorObject } from './lib/utils.js';

export default class NodeDefinition extends Node {
	static title = 'Darken Color';
	static type = 'studio.tokens.color.darken';
	static description = 'Darkens a color by a specified value';

	declare inputs: ToInput<{
		color: ColorType;
		value: number;
		space: ColorSpace;
	}>;

	declare outputs: ToOutput<{
		value: ColorType;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: {
				...ColorSchema,
				default: White
			}
		});
		this.addInput('value', {
			type: {
				...NumberSchema,
				default: 0.5,
				description: 'Value to apply to the modifier'
			}
		});

		this.addOutput('value', {
			type: ColorSchema
		});
	}

	execute(): void | Promise<void> {
		const { value, color } = this.getAllInputs();

		const sourceColor = toColor(color);
		const lightness = sourceColor.oklch.l;

		const newLightness = lightness * (1 - value);
		sourceColor.oklch.l = newLightness;
		const final = toColorObject(sourceColor);

		this.setOutput('value', final);
	}
}
