import { Black, White, toColor } from './lib/utils.js';
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

/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 */
export default class NodeDefinition extends Node {
	static title = 'Contrasting Color';
	static type = 'studio.tokens.color.contrasting';
	static description =
		'Evaluates the contrast ratio between two colors using the APCA-W3 algorithm, and identifies the color with the higher contrast. Outputs include the color with the highest contrast, the calculated contrast ratio, and a boolean indicating whether this ratio meets a specified sufficiency threshold. Users can adjust the threshold for sufficiency and choose between WCAG 3.0 (default) or other versions for the contrast calculation.';

	declare inputs: ToInput<{
		a: ColorType;
		b: ColorType;
		background: ColorType;
		algorithm: ContrastAlgorithm;
		threshold: number;
	}>;
	declare outputs: ToOutput<{
		color: ColorType;
		sufficient: boolean;
		contrast: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('a', {
			type: {
				...ColorSchema,
				default: White
			}
		});
		this.addInput('b', {
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

		this.addOutput('sufficient', {
			type: BooleanSchema
		});
		this.addOutput('color', {
			type: ColorSchema
		});
		this.addOutput('contrast', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { algorithm, a, b, background, threshold } = this.getAllInputs();

		const colorA = toColor(a);
		const colorB = toColor(b);
		const backgroundCol = toColor(background);

		const contrastA = Math.abs(backgroundCol.contrast(colorA, algorithm));
		const contrastB = Math.abs(backgroundCol.contrast(colorB, algorithm));

		if (contrastA > contrastB) {
			this.outputs.color.set(a);
			this.outputs.sufficient.set(contrastA >= threshold);
			this.outputs.contrast.set(contrastA);
		} else {
			this.outputs.color.set(b);
			this.outputs.sufficient.set(contrastB >= threshold);
			this.outputs.contrast.set(contrastB);
		}
	}
}
