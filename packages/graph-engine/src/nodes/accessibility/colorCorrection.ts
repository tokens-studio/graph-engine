import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';
import { toColor, toColorObject } from '../color/lib/utils.js';

export enum ColorVisionType {
	PROTANOPIA = 'protanopia',
	DEUTERANOPIA = 'deuteranopia',
	TRITANOPIA = 'tritanopia',
	GRAYSCALE = 'grayscale'
}

/**
 * Simulates how colors appear to people with color vision deficiencies
 */
export default class NodeDefinition extends Node {
	static title = 'Color Vision Simulation';
	static type = 'studio.tokens.accessibility.colorCorrection';
	static description =
		'Simulates how colors appear to people with color vision deficiencies';

	declare inputs: ToInput<{
		color: ColorType;
		type: ColorVisionType;
		strength: number;
	}>;

	declare outputs: ToOutput<{
		value: ColorType;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: {
				...ColorSchema,
				default: {
					space: 'srgb',
					channels: [0, 0, 0]
				}
			}
		});
		this.addInput('type', {
			type: {
				...StringSchema,
				title: 'Color Vision Type',
				enum: Object.values(ColorVisionType),
				default: ColorVisionType.DEUTERANOPIA
			}
		});
		this.addInput('strength', {
			type: {
				...NumberSchema,
				default: 1,
				minimum: 0,
				maximum: 1,
				description: 'Strength of the simulation (0-1)'
			}
		});

		this.addOutput('value', {
			type: ColorSchema
		});
	}

	// Convert sRGB to linear RGB using the specified formula
	private rgb2lin(channel: number): number {
		return (0.992052 * Math.pow(channel, 2.2) + 0.003974) * 128.498039;
	}

	// Convert linear RGB back to sRGB
	private lin2rgb(channel: number): number {
		// Unscale first, then apply inverse gamma
		return Math.pow(channel / 128.498039, 0.45454545);
	}

	// Clamp value between 0 and 1
	private saturate(value: number): number {
		return Math.max(0, Math.min(1, value));
	}

	execute(): void | Promise<void> {
		const { type, color, strength } = this.getAllInputs();
		const col = toColor(color);

		// Get normalized RGB values (0-1)
		const rgb = col.to('srgb');
		const r = this.saturate(rgb.r);
		const g = this.saturate(rgb.g);
		const b = this.saturate(rgb.b);

		// Convert to linear RGB
		const r_lin = this.rgb2lin(r);
		const g_lin = this.rgb2lin(g);
		const b_lin = this.rgb2lin(b);

		// Variables for the transformed color
		let transformed_r: number, transformed_g: number, transformed_b: number;

		switch (type) {
			case ColorVisionType.PROTANOPIA: {
				// Constants for protanopia
				const k1 = 14.443137;
				const k2 = 114.054902;
				const k3 = 0.513725;

				// Calculate simulated channels
				const r_blind_lin = (k1 * r_lin + k2 * g_lin) / 16448.25098;
				const b_blind_lin =
					(k3 * r_lin - k3 * g_lin + 128.498039 * b_lin) / 16448.25098;

				// Protanopia uses r_blind for both red and green channels
				transformed_r = r_blind_lin;
				transformed_g = r_blind_lin;
				transformed_b = b_blind_lin;
				break;
			}

			case ColorVisionType.DEUTERANOPIA: {
				// Constants for deuteranopia
				const k1 = 37.611765;
				const k2 = 90.87451;
				const k3 = -2.862745;

				// Calculate simulated channels
				const r_blind_lin = (k1 * r_lin + k2 * g_lin) / 16448.25098;
				const b_blind_lin =
					(k3 * r_lin - k3 * g_lin + 128.498039 * b_lin) / 16448.25098;

				// Deuteranopia uses r_blind for both red and green channels
				transformed_r = r_blind_lin;
				transformed_g = r_blind_lin;
				transformed_b = b_blind_lin;
				break;
			}

			case ColorVisionType.TRITANOPIA: {
				// Convert from linear RGB to LMS space
				const L =
					(r_lin * 0.0506 + g_lin * 0.085854 + b_lin * 0.009524) / 128.498039;
				const M =
					(r_lin * 0.01893 + g_lin * 0.089253 + b_lin * 0.013701) / 128.498039;

				// Constants for tritanopia - proper calculation of anchor points by summing components
				const anchor_e0 = 0.05059983 + 0.08585369 + 0.0095242;
				const anchor_e1 = 0.01893033 + 0.08925308 + 0.01370054;
				const anchor_e2 = 0.00292202 + 0.00975732 + 0.07146062;

				// Calculate the inflection point properly
				const inflection = anchor_e1 / anchor_e0;

				// Calculate coefficients for confusion lines exactly as in C++ code
				const a1 = -anchor_e2 * 0.007009;
				const b1 = anchor_e2 * 0.0914;
				const c1 = anchor_e0 * 0.007009 - anchor_e1 * 0.0914;

				const a2 = anchor_e1 * 0.3636 - anchor_e2 * 0.2237;
				const b2 = anchor_e2 * 0.1284 - anchor_e0 * 0.3636;
				const c2 = anchor_e0 * 0.2237 - anchor_e1 * 0.1284;

				// Calculate transformed S based on confusion line
				let S_transform: number;
				const tmp = M / L;

				if (tmp < inflection) {
					S_transform = -(a1 * L + b1 * M) / c1;
				} else {
					S_transform = -(a2 * L + b2 * M) / c2;
				}

				// Convert back to linear RGB
				const r_tritan_lin =
					L * 30.830854 - M * 29.832659 + S_transform * 1.610474;
				const g_tritan_lin =
					-L * 6.481468 + M * 17.715578 - S_transform * 2.532642;
				const b_tritan_lin =
					-L * 0.37569 - M * 1.199062 + S_transform * 14.273846;

				transformed_r = r_tritan_lin;
				transformed_g = g_tritan_lin;
				transformed_b = b_tritan_lin;
				break;
			}

			case ColorVisionType.GRAYSCALE: {
				// Calculate grayscale using NTSC weights to match the original shader
				const gray_srgb = r * 0.299 + g * 0.587 + b * 0.114;

				// Convert grayscale to linear space for consistency with other filters
				const gray_lin = this.rgb2lin(this.saturate(gray_srgb));

				// Set all channels to the same grayscale value
				transformed_r = gray_lin;
				transformed_g = gray_lin;
				transformed_b = gray_lin;
				break;
			}

			default:
				transformed_r = r_lin;
				transformed_g = g_lin;
				transformed_b = b_lin;
				break;
		}

		// Apply strength interpolation between original and simulated color
		transformed_r = r_lin * (1 - strength) + transformed_r * strength;
		transformed_g = g_lin * (1 - strength) + transformed_g * strength;
		transformed_b = b_lin * (1 - strength) + transformed_b * strength;

		// Ensure all values are positive before converting back
		transformed_r = Math.max(0, transformed_r);
		transformed_g = Math.max(0, transformed_g);
		transformed_b = Math.max(0, transformed_b);

		// Convert back to sRGB
		const final_r = this.saturate(this.lin2rgb(transformed_r));
		const final_g = this.saturate(this.lin2rgb(transformed_g));
		const final_b = this.saturate(this.lin2rgb(transformed_b));

		// Create the output color in the same color space as the input
		const outputColor = toColor({
			space: 'srgb',
			channels: [final_r, final_g, final_b]
		}).to(color.space);

		this.outputs.value.set(toColorObject(outputColor));
	}
}
