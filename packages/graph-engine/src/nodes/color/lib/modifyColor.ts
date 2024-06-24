import { ColorModifier, ColorModifierTypes } from '@tokens-studio/types';
import { darken } from './darken.js';
import { lighten } from './lighten.js';
import { mix } from './mix.js';
import { transparentize } from './transparentize.js';
import Color from 'colorjs.io';

export function modifyColor(
	baseColor: string,
	modifier: ColorModifier
): string {
	const color: Color = new Color(baseColor);
	let returnedColor: Color = color;
	switch (modifier.type) {
		case ColorModifierTypes.LIGHTEN:
			returnedColor = lighten(color, modifier.space, Number(modifier.value));
			break;
		case ColorModifierTypes.DARKEN:
			returnedColor = darken(color, modifier.space, Number(modifier.value));
			break;
		case ColorModifierTypes.MIX:
			returnedColor = mix(
				color,
				modifier.space,
				Number(modifier.value),
				new Color(modifier.color)
			);
			break;
		case ColorModifierTypes.ALPHA: {
			returnedColor = transparentize(color, Number(modifier.value));
			break;
		}
		default:
			throw new Error('Unknown color modifier type');
	}
	returnedColor = returnedColor.to(modifier.space);
	return returnedColor.toString({ inGamut: true, precision: 3 });
}

export function convertModifiedColorToHex(baseColor: string, modifier: ColorModifier) {
  let returnedColor = baseColor;
  returnedColor = modifyColor(baseColor, modifier);
  const returnedColorInSpace = new Color(returnedColor);
  return returnedColorInSpace.to("srgb").toString({ format: "hex" });
}
