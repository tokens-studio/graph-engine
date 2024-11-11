import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ContrastAlgorithm } from '../../types/index.js';
import { INodeDefinition } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { arrayOf } from '../../schemas/utils.js';
import { sortTokens } from './lib/sortColors.js';

export default class SortByDistanceNode extends Node {
	static title = 'Sort Colors by';
	static type = 'studio.tokens.color.sortColorsBy';
	static description =
		'Sorts Colors by constrast, distance, hue, lightness, or saturation to a Color';
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

		const sortedWithIndices = sortTokens(colors, compareColor, type, algorithm);

		this.outputs.value.set(sortedWithIndices.map(item => item.color));
		this.outputs.indices.set(sortedWithIndices.map(item => item.index));
	}
}
