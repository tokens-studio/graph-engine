import {
	BooleanSchema,
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { ContrastAlgorithm } from '../../types/index.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';
import { White, toColor } from './lib/utils.js';
import { arrayOf } from '../../schemas/utils.js';

/**
 * Evaluates an array of colors against a background color and returns the first one that meets the contrast threshold
 */
export default class NodeDefinition extends Node {
	static title = 'Contrasting from Array';
	static type = 'studio.tokens.color.contrastingFromArray';
	static description =
		'Takes an array of colors and returns the first one that meets the contrast threshold against the background color. If no color meets the threshold, returns the color with the highest contrast.';

	declare inputs: ToInput<{
		colors: ColorType[];
		background: ColorType;
		algorithm: ContrastAlgorithm;
		threshold: number;
	}>;
	declare outputs: ToOutput<{
		color: ColorType;
		sufficient: boolean;
		contrast: number;
		index: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('colors', {
			type: arrayOf(ColorSchema)
		});
		this.addInput('background', {
			type: {
				...ColorSchema,
				default: White
			}
		});

		this.addInput('algorithm', {
			type: {
				...StringSchema,
				enum: Object.values(ContrastAlgorithm),
				default: ContrastAlgorithm.APCA
			}
		});
		this.addInput('threshold', {
			type: {
				...NumberSchema,
				default: 60
			}
		});

		this.addOutput('sufficient', {
			type: BooleanSchema
		});
		this.addOutput('color', {
			type: ColorSchema
		});
		this.addOutput('contrast', {
			type: NumberSchema
		});
		this.addOutput('index', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { algorithm, colors, background, threshold } = this.getAllInputs();

		if (!colors || colors.length === 0) {
			throw new Error('No colors provided');
		}

		const backgroundCol = toColor(background);
		let maxContrast = -Infinity;
		let maxContrastColor = colors[0];
		let maxContrastIndex = 0;

		// Find the first color that meets the threshold, or the one with highest contrast
		for (let i = 0; i < colors.length; i++) {
			const color = colors[i];
			const contrast = Math.abs(
				backgroundCol.contrast(toColor(color), algorithm)
			);

			if (contrast >= threshold) {
				// Found a color that meets the threshold, return it immediately
				this.outputs.color.set(color);
				this.outputs.sufficient.set(true);
				this.outputs.contrast.set(contrast);
				this.outputs.index.set(i);
				return;
			}

			if (contrast > maxContrast) {
				maxContrast = contrast;
				maxContrastColor = color;
				maxContrastIndex = i;
			}
		}

		// If we get here, no color met the threshold, return the one with highest contrast
		this.outputs.color.set(maxContrastColor);
		this.outputs.sufficient.set(false);
		this.outputs.contrast.set(maxContrast);
		this.outputs.index.set(maxContrastIndex);
	}
}
