/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 *
 * @packageDocumentation
 */
import { Black, White, toColor, toColorObject } from './lib/utils.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ContrastAlgorithm } from '../../types/index.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { Input, Output } from '../../programmatic/index.js';
import { flattenAlpha } from './lib/flattenAlpha.js';
import Color from 'colorjs.io';

export const contrastCheck = (
	foreground: Color,
	background: Color,
	algorithm
): number => {
	return Math.abs(foreground.contrast(background, algorithm));
};

export default class NodeDefinition extends Node {
	static title = 'Contrasting Alpha';
	static type = 'studio.tokens.color.contrastingAlpha';
	static description = 'Reduce alpha until you are close to the threshold.';

	declare inputs: {
		a: Input;
		b: Input;
		background: Input;
		wcag: Input;
		threshold: Input<number>;
	};
	declare outputs: {
		color: Output;
		sufficient: Output<boolean>;
		contrast: Output<number>;
	};

	constructor(props: INodeDefinition) {
		super(props);

		// Inputs
		this.addInput('foreground', {
			type: {
				...ColorSchema,
				default: Black
			}
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
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 5
			}
		});

		// Outputs
		this.addOutput('alpha', {
			type: NumberSchema
		});
		this.addOutput('color', {
			type: ColorSchema
		});
		this.addOutput('contrast', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { algorithm, foreground, background, threshold, precision } =
			this.getAllInputs();

		const binarySearchAlpha = (
			low,
			high,
			fg,
			bg,
			targetContrast,
			iterations
		) => {
			if (iterations == 0 || high - low < 0.01) {
				// Adding a minimum delta to prevent infinite recursion
				fg.alpha = high; // Default to higher alpha if exact match isn't found
				return high; // Ensure we are returning the alpha that provides sufficient contrast
			}

			const mid = (low + high) / 2;
			fg.alpha = mid;

			// Convert blended color back to Color object and then to hex string
			const solidColor = flattenAlpha(fg, bg);

			currentContrast = contrastCheck(solidColor, bg, algorithm);

			if (currentContrast >= targetContrast) {
				return binarySearchAlpha(
					low,
					mid,
					fg,
					bg,
					targetContrast,
					iterations - 1
				);
			} else {
				return binarySearchAlpha(
					mid,
					high,
					fg,
					bg,
					targetContrast,
					iterations - 1
				);
			}
		};

		const foregroundColor = toColor(foreground);
		const backgroundColor = toColor(background);
		let currentContrast = contrastCheck(
			foregroundColor,
			backgroundColor,
			algorithm
		);

		if (currentContrast <= threshold) {
			this.setOutput('alpha', 1);
			this.setOutput(
				'color',
				foregroundColor.to('srgb').toString({ format: 'hex' })
			);
			this.setOutput('contrast', currentContrast);
			return;
		}

		const finalAlpha = binarySearchAlpha(
			0,
			1,
			foregroundColor,
			backgroundColor,
			threshold,
			precision
		);

		foregroundColor.alpha = finalAlpha;
		const finalColor = flattenAlpha(foregroundColor, backgroundColor);
		const finalContrast = Math.abs(
			finalColor.contrast(backgroundColor, algorithm)
		);

		this.setOutput('alpha', finalAlpha);
		this.setOutput('color', toColorObject(finalColor));
		this.setOutput('contrast', finalContrast);
	}
}
