import { Black, toColor } from './lib/utils.js';
import { Color } from '../../types.js';
import { ColorSchema, StringSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition extends Node {
	static title = 'Color to string';
	static type = 'studio.tokens.color.colorToString';
	static description = 'Converts a color to a string';

	declare inputs: ToInput<{
		color: Color;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: {
				...ColorSchema,
				default: Black
			}
		});
		this.addInput('space', {
			type: {
				...StringSchema,
				enum: ['srgb', 'hsl', 'hex'],
				default: 'hex'
			},
			visible: false
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const color = this.getInput('color');
		let space = this.getInput('space');
		let format = undefined;

		if (space == 'hex') {
			space = 'srgb';
			format = {
				format: 'hex'
			};
		}

		const col = toColor(color).to(space).toString(format);
		this.setOutput('value', col);
	}
}
