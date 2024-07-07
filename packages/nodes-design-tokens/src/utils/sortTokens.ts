import { compareFunctions } from './compareFunctions';
import Color from 'colorjs.io';
import orderBy from 'lodash.orderby';

export enum WcagVersion {
	V2 = '2.1',
	V3 = '3.0'
}

export const sortTokens = (tokens, sourceColor, compare, wcag, inverted) =>
	orderBy(
		tokens.map(token => {
			const foreground = new Color(token.value);
			const background = new Color(sourceColor);
			const compareValue = compareFunctions[compare](
				foreground,
				background,
				wcag
			);

			return {
				...token,
				compareValue
			};
		}),
		['compareValue'],
		[inverted ? 'desc' : 'asc']
	);
