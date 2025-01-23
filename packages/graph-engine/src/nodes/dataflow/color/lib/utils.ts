import { Color as ColorType } from '../../../../types.js';
import Color from 'colorjs.io';

export const toColor = (color: ColorType): Color => {
	const colorInstance = new Color(color.space, color.channels, color.alpha);
	return colorInstance;
};

export const toColorObject = (color: Color): ColorType => {
	return {
		space: color.space.id,
		channels: color.coords,
		alpha: color.alpha
	};
};

export const toHex = (color: Color): string =>
	color.to('srgb').toString({ format: 'hex' });

export const hexToColor = (hex: string): ColorType => {
	return toColorObject(new Color(hex));
};

export const Black = {
	space: 'srgb',
	channels: [0, 0, 0]
} as ColorType;

export const White = {
	space: 'srgb',
	channels: [1, 1, 1]
} as ColorType;

export const Gray = {
	space: 'srgb',
	channels: [0.5, 0.5, 0.5]
} as ColorType;

export const Red = {
	space: 'srgb',
	channels: [1, 0, 0]
} as ColorType;
