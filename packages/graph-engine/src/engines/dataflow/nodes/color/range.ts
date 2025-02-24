import { Black, White, toColor, toColorObject } from './lib/utils.js';
import {
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ColorSpaces } from './lib/spaces.js';
import { Color as ColorType } from '../../types.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '@/utils/precision.js';

const HUE_METHODS = [
	'shorter',
	'longer',
	'increasing',
	'decreasing',
	'raw'
] as const;
const PROGRESSION_TYPES = ['linear', 'quadratic', 'cubic'] as const;

const progressionFunctions = {
	linear: (p: number) => p,
	quadratic: (p: number) => p * p,
	cubic: (p: number) => p * p * p
};

const roundColorChannels = (color: ColorType): ColorType => {
	return {
		...color,
		channels: [
			Math.abs(setToPrecision(color.channels[0], 6)),
			Math.abs(setToPrecision(color.channels[1], 6)),
			Math.abs(setToPrecision(color.channels[2], 6))
		] as [number, number, number],
		alpha: color.alpha ? setToPrecision(color.alpha, 6) : undefined
	};
};

export default class NodeDefinition extends Node {
	static title = 'Range';
	static type = 'studio.tokens.color.range';
	static description =
		'Creates a range/gradient between two colors with customizable interpolation options';

	declare inputs: ToInput<{
		colorA: ColorType;
		colorB: ColorType;
		space: string;
		hue: (typeof HUE_METHODS)[number];
		steps: number;
		progression: (typeof PROGRESSION_TYPES)[number];
	}>;

	declare outputs: ToOutput<{
		colors: ColorType[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('colorA', {
			type: {
				...ColorSchema,
				default: White
			}
		});

		this.addInput('colorB', {
			type: {
				...ColorSchema,
				default: Black
			}
		});

		this.addInput('space', {
			type: {
				...StringSchema,
				enum: ColorSpaces,
				default: 'lab'
			}
		});

		this.addInput('hue', {
			type: {
				...StringSchema,
				enum: HUE_METHODS,
				default: 'shorter'
			}
		});

		this.addInput('steps', {
			type: {
				...NumberSchema,
				default: 5,
				minimum: 2
			}
		});

		this.addInput('progression', {
			type: {
				...StringSchema,
				enum: PROGRESSION_TYPES,
				default: 'linear'
			}
		});

		this.addOutput('colors', {
			type: arrayOf(ColorSchema)
		});
	}

	execute(): void | Promise<void> {
		const { colorA, colorB, space, hue, steps, progression } =
			this.getAllInputs();

		const color1 = toColor(colorA);
		const color2 = toColor(colorB);

		const range = color1.range(color2, {
			space,
			hue,
			outputSpace: colorA.space
		});

		const progressionFn = progressionFunctions[progression];
		const colors: ColorType[] = [];

		for (let i = 0; i < steps; i++) {
			const progress = i / (steps - 1);
			const adjustedProgress = progressionFn(progress);
			const color = range(adjustedProgress);

			// Preserve original color spaces for endpoints
			const outputSpace =
				i === 0 ? colorA.space : i === steps - 1 ? colorB.space : colorA.space;

			colors.push(
				roundColorChannels({
					...toColorObject(color),
					space: outputSpace
				})
			);
		}

		this.outputs.colors.set(colors);
	}
}
