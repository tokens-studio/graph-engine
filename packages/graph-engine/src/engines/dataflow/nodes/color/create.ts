import { Color } from '../../types.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
export { ColorModifierTypes } from '@tokens-studio/types';
import { ColorSpace, colorSpaces } from './lib/types.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Create Color';
	static type = 'studio.tokens.color.create';
	static description =
		'Creates a color in a given color space with the specified channel values (using the ports a, b, c, etc) and returns it as a color object';

	declare inputs: ToInput<{
		/**
		 * The color space to create the color in
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
		 * The fourth channel value
		 */
		alpha?: number;
	}>;

	declare outputs: ToOutput<{
		value: Color;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('space', {
			type: {
				...StringSchema,
				enum: colorSpaces,
				default: 'srgb'
			}
		});
		this.addInput('a', {
			type: {
				...NumberSchema,
				default: '0'
			}
		});
		this.addInput('b', {
			type: {
				...NumberSchema,
				default: '0'
			}
		});
		this.addInput('c', {
			type: {
				...NumberSchema,
				default: '0'
			}
		});

		//No default on alpha as this might result in Hex8 colors which are not always desired
		this.addInput('alpha', {
			type: {
				...NumberSchema
			}
		});

		this.addOutput('value', {
			type: ColorSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b, c, alpha, space } = this.getAllInputs();

		const color = {
			space,
			channels: [a, b, c],
			alpha: alpha
		} as Color;
		this.outputs.value.set(color);
	}
}
