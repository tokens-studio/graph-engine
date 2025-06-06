import { Color } from '../../types.js';
import { ColorSchema, StringSchema } from '../../schemas/index.js';
import { ColorSpace, ColorSpaces } from './lib/spaces.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { toColor, toColorObject } from './lib/utils.js';

export default class NodeDefinition extends Node {
	static title = 'Convert Color';
	static type = 'studio.tokens.color.convert';
	static description = 'Transforms a color from one space to another';
	declare inputs: ToInput<{
		color: Color;
		space: ColorSpace;
	}>;

	declare outputs: ToOutput<{
		color: Color;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: ColorSchema
		});
		this.addInput('space', {
			type: {
				...StringSchema,
				enum: ColorSpaces,
				default: 'srgb'
			}
		});
		this.addOutput('color', {
			type: ColorSchema
		});
	}

	execute(): void | Promise<void> {
		const { color, space } = this.getAllInputs();

		if (!ColorSpaces.includes(space)) {
			throw new Error('Invalid color space ' + space);
		}

		const colObj = toColor(color);

		//Convert back to coords

		this.outputs.color.set(toColorObject(colObj.to(space)));
	}
}
