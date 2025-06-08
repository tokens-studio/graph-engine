import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { Red, toColor, toColorObject } from './lib/utils.js';
import Color from 'colorjs.io';

type HarmonyType =
	| 'analogous'
	| 'complementary'
	| 'splitComplementary'
	| 'triadic'
	| 'tetradic';

const HarmonyTypeSchema = {
	...StringSchema,
	title: 'Harmony Type',
	enum: [
		'analogous',
		'complementary',
		'splitComplementary',
		'triadic',
		'tetradic'
	]
};

export default class NodeDefinition extends Node {
	static title = 'Color Harmonies';
	static type = 'studio.tokens.color.harmonies';
	static description =
		'Generates harmonious color combinations based on color theory';

	declare inputs: ToInput<{
		color: ColorType;
		harmonyType: HarmonyType;
		numberOfColors: number;
	}>;

	declare outputs: ToOutput<{
		colors: ColorType[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: {
				...ColorSchema,
				default: Red
			}
		});
		this.addInput('harmonyType', {
			type: {
				...HarmonyTypeSchema,
				default: 'triadic'
			}
		});
		this.addInput('numberOfColors', {
			type: {
				...NumberSchema,
				default: 3
			}
		});
		this.addOutput('colors', {
			type: {
				type: 'array',
				items: ColorSchema
			}
		});
	}

	execute(): void | Promise<void> {
		const { color, harmonyType, numberOfColors } = this.getAllInputs();
		const colorInstance = toColor(color);
		let harmonies: ColorType[] = [];

		// Convert to HSL for easier manipulation
		const hslColor = colorInstance.to('hsl');
		const baseHue = hslColor.coords[0];
		const saturation = hslColor.coords[1];
		const lightness = hslColor.coords[2];

		// Calculate hue shifts based on harmony type
		let hueShifts: number[] = [];
		switch (harmonyType) {
			case 'analogous':
				hueShifts = [-30, 30];
				break;
			case 'complementary':
				hueShifts = [180];
				break;
			case 'splitComplementary':
				hueShifts = [150, -150];
				break;
			case 'triadic':
				hueShifts = [120, -120];
				break;
			case 'tetradic':
				hueShifts = [90, 180, -90];
				break;
		}

		// Start with the base color
		harmonies.push(color);

		// Generate harmony colors
		for (const shift of hueShifts) {
			let newHue = (baseHue + shift) % 360;
			if (newHue < 0) newHue += 360;

			const newColor = new Color(
				'hsl',
				[newHue, saturation, lightness],
				color.alpha
			);
			harmonies.push(toColorObject(newColor));
		}

		// Ensure we return the requested number of colors
		if (harmonies.length > numberOfColors) {
			harmonies = harmonies.slice(0, numberOfColors);
		} else if (harmonies.length < numberOfColors) {
			const originalLength = harmonies.length;
			for (let i = originalLength; i < numberOfColors; i++) {
				harmonies.push(harmonies[i % originalLength]);
			}
		}

		this.outputs.colors.set(harmonies);
	}
}
