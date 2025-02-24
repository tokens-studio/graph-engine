import { Color } from '../../types.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ColorSpace } from './lib/types.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';

export default class DestructColorNode extends DataflowNode {
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
		this.dataflow.addInput('color', {
			type: ColorSchema
		});

		this.dataflow.addOutput('space', {
			type: StringSchema
		});
		this.dataflow.addOutput('a', {
			type: NumberSchema
		});
		this.dataflow.addOutput('b', {
			type: NumberSchema
		});
		this.dataflow.addOutput('c', {
			type: NumberSchema
		});
		this.dataflow.addOutput('alpha', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { color } = this.getAllInputs();

		if (!color || !color.channels || !color.space) {
			throw new Error('Invalid color input');
		}

		this.outputs.space.set(color.space);
		this.outputs.a.set(color.channels[0]);
		this.outputs.b.set(color.channels[1]);
		this.outputs.c.set(color.channels[2]);

		// Only set alpha if it exists
		if (color.alpha !== undefined) {
			this.outputs.alpha.set(color.alpha);
		} else {
			this.outputs.alpha.set(undefined);
		}
	}
}
