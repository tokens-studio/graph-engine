import { ColorSchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { toColor } from './lib/utils.js';

export default class NodeDefinition extends Node {
	static title = 'Match Alpha';
	static type = 'studio.tokens.color.matchAlpha';
	static description =
		'Finds the alpha value that, when used to blend the foreground and background colors, will result in the reference color.';
	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('foreground', {
			type: {
				...ColorSchema
			}
		});
		this.addInput('background', {
			type: {
				...ColorSchema
			}
		});
		this.addInput('reference', {
			type: {
				...ColorSchema
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 0.01
			}
		});

		this.addOutput('alpha', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { foreground, background, reference, precision } =
			this.getAllInputs();

		const bg = toColor(background);
		const fg = toColor(foreground);
		const ref = toColor(reference);

		let alpha = Number.NaN;

		// the matching is done per channel

		// if the background and reference are "the same" (within precision), return zero
		if (
			Math.abs(bg.r - ref.r) < precision &&
			Math.abs(bg.g - ref.g) < precision &&
			Math.abs(bg.b - ref.b) < precision
		) {
			alpha = 0;
		} else {
			// find the matching alpha for each channel
			let ar = (ref.r - bg.r) / (fg.r - bg.r);
			let ag = (ref.g - bg.g) / (fg.g - bg.g);
			let ab = (ref.b - bg.b) / (fg.b - bg.b);

			// set out-of-range alphas to NaN
			if (ar < 0 || ar > 1) ar = Number.NaN;
			if (ag < 0 || ag > 1) ag = Number.NaN;
			if (ab < 0 || ab > 1) ab = Number.NaN;

			// return the average of the alphas for all matched channels
			if (!isNaN(ar) && !isNaN(ag) && !isNaN(ab)) {
				if (
					Math.abs(ar - ag) < precision &&
					Math.abs(ag - ab) < precision &&
					Math.abs(ar - ab) < precision
				) {
					alpha = (ar + ag + ab) / 3;
				}
			} else if (!isNaN(ar) && !isNaN(ag)) {
				if (Math.abs(ar - ag) < precision) {
					alpha = (ar + ag) / 2;
				}
			} else if (!isNaN(ag) && !isNaN(ab)) {
				if (Math.abs(ag - ab) < precision) {
					alpha = (ag + ab) / 2;
				}
			} else if (!isNaN(ar) && !isNaN(ab)) {
				if (Math.abs(ar - ab) < precision) {
					alpha = (ar + ab) / 2;
				}
			} else {
				alpha = ar || ag || ab;
			}
		}

		// round the result to match the precision
		const decimals = Math.max(0, -Math.floor(Math.log10(precision)));
		alpha = roundTo(alpha, decimals);

		this.outputs.alpha.set(alpha);
	}
}

function roundTo(value: number, decimals: number): number {
	const dec = Math.pow(10, decimals);
	return Math.round(value * dec) / dec;
}
