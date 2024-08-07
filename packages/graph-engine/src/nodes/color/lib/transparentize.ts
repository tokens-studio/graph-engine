import Color from 'colorjs.io';

export function transparentize(color: Color, amount: number): Color {
	color.alpha = Math.max(0, Math.min(1, Number(amount)));
	return color;
}
