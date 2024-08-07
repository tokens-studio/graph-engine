import { ColorSchema, StringSchema } from '../../schemas/index.js';
import { ContrastAlgorithm } from '../../types/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../index.js';
import { arrayOf } from '../../schemas/utils.js';
import { sortTokens } from './lib/sortColors.js';

export default class SortByDistanceNode extends DataflowNode {
	static title = 'Sort Colors by';
	static type = 'studio.tokens.color.sortColorsBy';
	static description =
		'Sorts Colors by constrast, distance, hue, lightness, or saturation to a Color';
	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('colors', {
			type: arrayOf(ColorSchema)
		});
		this.dataflow.addInput('compareColor', {
			type: ColorSchema
		});
		this.dataflow.addInput('type', {
			type: {
				...StringSchema,
				default: 'Hue',
				enum: ['Contrast', 'Hue', 'Lightness', 'Saturation', 'Distance']
			}
		});
		this.dataflow.addInput('algorithm', {
			type: {
				...StringSchema,
				enum: Object.values(ContrastAlgorithm),
				default: ContrastAlgorithm.APCA
			}
		});

		this.dataflow.addOutput('value', {
			type: arrayOf(ColorSchema)
		});
	}

	execute(): void | Promise<void> {
		const { colors, compareColor, type, algorithm } = this.getAllInputs();

		const sortedTokens = sortTokens(colors, compareColor, type, algorithm);

		this.outputs.value.set(sortedTokens);
	}
}
