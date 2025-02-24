import { Black, Gray, White, toColor, toColorObject } from './lib/utils.js';
import {
	BooleanSchema,
	ColorSchema,
	NumberSchema
} from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { setToPrecision } from '@/utils/precision.js';
import Color from 'colorjs.io';

export default class NodeDefinition extends Node {
	static title = 'Match Alpha';
	static type = 'studio.tokens.color.matchAlpha';
	static description =
		'Finds the alpha value that, when used to blend the foreground and background colors, will result in the reference color.';

	declare inputs: ToInput<{
		foreground: ColorType;
		background: ColorType;
		reference: ColorType;
		threshold: number;
		precision: number;
	}>;
	declare outputs: ToOutput<{
		inRange: boolean;
		color: ColorType;
		alpha: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

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
		this.addInput('reference', {
			type: {
				...ColorSchema,
				default: Gray
			}
		});
		this.addInput('threshold', {
			type: {
				...NumberSchema,
				default: 0.01
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 0.01
			}
		});

		this.addOutput('inRange', {
			type: BooleanSchema
		});
		this.addOutput('color', {
			type: ColorSchema
		});
		this.addOutput('alpha', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { foreground, background, reference, threshold, precision } =
			this.getAllInputs();

		const bg = toColor(background);
		const fg = toColor(foreground);
		const ref = toColor(reference);

		let alpha = Number.NaN;
		let inRange = false;

		// the matching is done per channel

		// if the background and reference are "the same" (within precision), return zero
		if (
			Math.abs(bg.r - ref.r) < precision &&
			Math.abs(bg.g - ref.g) < precision &&
			Math.abs(bg.b - ref.b) < precision
		) {
			alpha = 0;
			inRange = true;
		} else {
			// find the matching alpha for each channel
			const ar = validateAlpha((ref.r - bg.r) / (fg.r - bg.r));
			const ag = validateAlpha((ref.g - bg.g) / (fg.g - bg.g));
			const ab = validateAlpha((ref.b - bg.b) / (fg.b - bg.b));

			// return the average of the alphas for all matched channels
			if (!isNaN(ar) && !isNaN(ag) && !isNaN(ab)) {
				if (
					Math.abs(ar - ar) < precision &&
					Math.abs(ag - ag) < precision &&
					Math.abs(ab - ab) < precision
				) {
					alpha = (ar + ag + ab) / 3;
					inRange = true;
				}
			} else if (!isNaN(ar) && !isNaN(ag)) {
				if (Math.abs(ar - ag) < precision) {
					alpha = (ar + ag) / 2;
					inRange = true;
				}
			} else if (!isNaN(ag) && !isNaN(ab)) {
				if (Math.abs(ag - ab) < precision) {
					alpha = (ag + ab) / 2;
					inRange = true;
				}
			} else if (!isNaN(ar) && !isNaN(ab)) {
				if (Math.abs(ar - ab) < precision) {
					alpha = (ar + ab) / 2;
					inRange = true;
				}
			} else {
				alpha = ar || ag || ab;
				inRange = !isNaN(alpha);
			}
		}

		// round the result to match the precision
		alpha = setToPrecision(
			alpha,
			Math.max(0, -Math.floor(Math.log10(precision)))
		);

		// calculate the composite color, and if it's too far from the reference, return NaN
		// deltaE() returns values typically ranging from 0 to 100, so I divide it by 100
		// to compare normalized colors
		const comp = blendColors(fg, bg, alpha);

		if (comp.deltaE2000(ref) / 100 > threshold) {
			alpha = Number.NaN;
			inRange = false;
		}

		// if the resulting alpha is valid, assign it to the foreground color,
		// which becomes the output color
		if (inRange) fg.alpha = alpha;

		this.outputs.inRange.set(inRange);
		this.outputs.color.set(toColorObject(fg));
		this.outputs.alpha.set(alpha);
	}
}

function validateAlpha(alpha: number) {
	// set valid but out-of-range alphas to NaN
	return !isNaN(alpha) && alpha >= 0 && alpha <= 1 ? alpha : Number.NaN;
}

function blendChannels(fg: number, bg: number, alpha: number) {
	return fg * alpha + bg * (1 - alpha);
}

function blendColors(fg: Color, bg: Color, alpha: number) {
	return new Color('srgb', [
		blendChannels(fg.r, bg.r, alpha),
		blendChannels(fg.g, bg.g, alpha),
		blendChannels(fg.b, bg.b, alpha)
	]);
}
