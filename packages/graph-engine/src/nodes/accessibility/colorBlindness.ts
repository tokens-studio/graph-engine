import {
	Color,
	INodeDefinition,
	ToInput,
	ToOutput,
	hexToColor,
	toColor,
	toHex
} from '../../index.js';
import { ColorSchema, StringSchema } from '../../schemas/index.js';
import { Node } from '../../programmatic/node.js';
import blinder from 'color-blind-esm';

export enum ColorBlindnessTypes {
	TRITANOPIA = 'tritanopia',
	TRITANOMALY = 'tritanomaly',
	DEUTERANOPIA = 'deuteranopia',
	DEUTERANOMALY = 'deuteranomaly',
	PROTANOPIA = 'protanopia',
	PROTANOMALY = 'protanomaly',
	ACHROMATOPSIA = 'achromatopsia',
	ACHROMATOMALY = 'achromatomaly'
}

/**
 * Converts provided colors to the colors as perceived by the specified color blindness type.
 */
export default class NodeDefinition extends Node {
	static title = 'Color Blindness';
	static type = 'studio.tokens.accessibility.colorBlindness';
	static description =
		'Converts provided colors to the colors as perceived by the specified color blindness type. The output is a hex color string. The color blindness types include protanopia, protanomaly, deuteranopia, deuteranomaly, tritanopia, tritanomaly, achromatopsia, and achromatomaly. The output is a hex color string.';

	declare inputs: ToInput<{
		color: Color;
		type: ColorBlindnessTypes;
	}>;

	declare outputs: ToOutput<{
		/**
		 * The calculated color contrast based on the input color and the specified color blindness type.
		 */
		value: Color;
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
				title: 'Color Blindness Type',
				enum: Object.values(ColorBlindnessTypes),
				default: ColorBlindnessTypes.PROTANOPIA
			}
		});

		this.addOutput('value', {
			type: ColorSchema
		});
	}

	execute(): void | Promise<void> {
		const { type, color } = this.getAllInputs();

		let processed = toHex(toColor(color));

		switch (type) {
			case ColorBlindnessTypes.TRITANOPIA:
				processed = blinder.tritanopia(processed);
				break;
			case ColorBlindnessTypes.TRITANOMALY:
				processed = blinder.tritanomaly(processed);
				break;
			case ColorBlindnessTypes.DEUTERANOPIA:
				processed = blinder.deuteranopia(processed);
				break;
			case ColorBlindnessTypes.DEUTERANOMALY:
				processed = blinder.deuteranomaly(processed);
				break;

			case ColorBlindnessTypes.PROTANOMALY:
				processed = blinder.protanomaly(processed);
				break;
			case ColorBlindnessTypes.ACHROMATOPSIA:
				processed = blinder.achromatopsia(processed);
				break;
			case ColorBlindnessTypes.ACHROMATOMALY:
				processed = blinder.achromatomaly(processed);
				break;
			default:
				processed = blinder.protanopia(processed);
				break;
		}

		const asCol = hexToColor(processed);

		this.outputs.value.set(asCol);
	}
}
