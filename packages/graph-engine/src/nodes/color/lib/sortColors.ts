import { toColor } from './utils.js';
import orderBy from 'lodash.orderby';

export const compareFunctions = {
	Contrast: (foreground, background, algorithm) => {
		Math.abs(background.contrast(foreground, algorithm));
	},
	Hue: (foreground, background) =>
		Math.abs(foreground.hsl[0] - background.hsl[0]),
	Lightness: (foreground, background) =>
		Math.abs(foreground.contrast(background, 'Lstar')),
	Saturation: (foreground, background) =>
		Math.abs(foreground.hsl[1] - background.hsl[1]),
	Distance: (foreground, background) => foreground.deltaE(background, '2000')
};

export const sortTokens = (colors, compareColor, type, algorithm) =>
	orderBy(
		colors.map(color => {
			const foreground = toColor(color);
			const background = toColor(compareColor);
			const compareValue = compareFunctions[type](
				foreground,
				background,
				algorithm
			);

			return {
				color,
				compareValue
			};
		}),
		['compareValue']
	).map(color => color.color);
