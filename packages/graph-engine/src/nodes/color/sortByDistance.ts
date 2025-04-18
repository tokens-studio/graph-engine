import { Color, INodeDefinition, ToInput, ToOutput } from '../../index.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ContrastAlgorithm } from '../../types/index.js';
import { Node } from '../../programmatic/node.js';
import { arrayOf } from '../../schemas/utils.js';
import { sortTokens } from './lib/sortColors.js';

export default class SortByDistanceNode extends Node {
	static title = 'Sort Colors By Distance';
	static type = 'studio.tokens.color.sortColorsBy';
	static description =
		'Sorts Colors by contrast, distance, hue, lightness, or saturation to a Color';

	declare inputs: ToInput<{
		colors: Color[];
		compareColor: Color;
		type: 'Contrast' | 'Hue' | 'Lightness' | 'Saturation' | 'Distance';
		algorithm: ContrastAlgorithm;
	}>;

	declare outputs: ToOutput<{
		value: Color[];
		indices: number[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('colors', {
			type: arrayOf(ColorSchema)
		});
		this.addInput('compareColor', {
			type: ColorSchema
		});
		this.addInput('type', {
			type: {
				...StringSchema,
				default: 'Hue',
				enum: ['Contrast', 'Hue', 'Lightness', 'Saturation', 'Distance']
			}
		});
		this.addInput('algorithm', {
			type: {
				...StringSchema,
				enum: Object.values(ContrastAlgorithm),
				default: ContrastAlgorithm.APCA
			}
		});

		this.addOutput('value', {
			type: arrayOf(ColorSchema)
		});
		this.addOutput('indices', {
			type: arrayOf(NumberSchema)
		});
	}

	execute(): void | Promise<void> {
		const { colors, compareColor, type, algorithm } = this.getAllInputs();
		const sorted = sortTokens(colors, compareColor, type, algorithm);

		this.outputs.value.set(sorted.colors);
		this.outputs.indices.set(sorted.indices);
	}
}
