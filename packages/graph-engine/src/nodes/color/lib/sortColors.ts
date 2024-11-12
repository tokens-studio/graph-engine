import { Color } from '@/types.js';
import { toColor } from './utils.js';

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

export type SortedTokens = { colors: Color[]; indices: number[] };

export const sortTokens = (
	colors,
	compareColor,
	type,
	algorithm
): SortedTokens => {
	const background = toColor(compareColor);
	const compareFunction = compareFunctions[type];

	return colors
		.reduce((acc, color, index) => {
			const foreground = toColor(color);
			const compareValue = compareFunction(foreground, background, algorithm);

			acc.push({
				color,
				compareValue,
				index
			});
			return acc;
		}, [])
		.sort((a, b) => a.compareValue - b.compareValue)
		.reduce(
			(acc, { color, index }) => {
				acc.colors.push(color);
				acc.indices.push(index);
				return acc;
			},
			{ colors: [], indices: [] } as SortedTokens
		);
};
