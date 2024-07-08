import { ColorSchema } from '../../schemas/index.js';
import { INodeDefinition } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { flattenAlpha } from './lib/flattenAlpha.js';
import { toColor, toColorObject } from './lib/utils.js';

export default class NodeDefinition extends Node {
	static title = 'Flatten Alpha';
	static type = 'studio.tokens.color.flattenAlpha';
	static description =
		'Reduces two colors to one by blending them together and removing the alpha channel. Expects a background color without alpha. The foreground color with alpha will be blended on top of the background color. The output is a hex color string.';
	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('foreground', {
			type: {
				...ColorSchema
			}
		});
		this.addInput('background', {
			type: {
				...ColorSchema
			}
		});

		this.addOutput('value', {
			type: ColorSchema
		});
	}

	execute(): void | Promise<void> {
		const { foreground, background } = this.getAllInputs();

		// Create color objects from strings
		const bg = toColor(background);
		const fg = toColor(foreground);

		const resultColor = flattenAlpha(fg, bg);
		this.setOutput('value', toColorObject(resultColor));
	}
}
