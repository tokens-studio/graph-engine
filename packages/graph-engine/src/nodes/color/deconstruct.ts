import { Color } from '../../types.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ColorSpace } from './lib/spaces.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class DestructColorNode extends Node {
	static title = 'Deconstruct Color';
	static type = 'studio.tokens.color.deconstruct';
	static description =
		'Deconstructs a color object into its individual components';

	declare inputs: ToInput<{
		/**
		 * The color to deconstruct
		 */
		color: Color;
	}>;

	declare outputs: ToOutput<{
		/**
		 * The color space of the input color
		 */
		space: ColorSpace;
		/**
		 * The first channel value
		 */
		a: number;
		/**
		 * The second channel value
		 */
		b: number;
		/**
		 * The third channel value
		 */
		c: number;
		/**
		 * The fourth channel value (alpha)
		 */
		alpha?: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: ColorSchema
		});

		this.addOutput('space', {
			type: StringSchema
		});
		this.addOutput('a', {
			type: NumberSchema
		});
		this.addOutput('b', {
			type: NumberSchema
		});
		this.addOutput('c', {
			type: NumberSchema
		});
		this.addOutput('alpha', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { color } = this.getAllInputs();

		if (!color || !color.channels || !color.space) {
			throw new Error('Invalid color input');
		}

		this.setOutput('space', color.space);
		this.setOutput('a', color.channels[0]);
		this.setOutput('b', color.channels[1]);
		this.setOutput('c', color.channels[2]);

		// Only set alpha if it exists
		if (color.alpha !== undefined) {
			this.setOutput('alpha', color.alpha);
		} else {
			this.setOutput('alpha', undefined);
		}
	}
}
