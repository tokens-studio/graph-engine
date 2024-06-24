import { DeepKeyTokenMap, SingleToken, TokenTypes } from '@tokens-studio/types';
import { setProperty } from 'dot-prop';

export interface IResolvedToken {
	/**
	 * Name of the token
	 */
	name: string;
	/**
	 * Expression that represents the value of the token, botentially jsons stringified
	 */
	value: SingleToken['value'];
	/**
	 * The type of the token
	 */
	type: TokenTypes;
	/**
	 * Optional description of the token
	 */
	description?: string;
}

/**
 * Takes in a nested object of tokens and returns a flattened array of tokens
 * @param nested
 * @param keyPath Optional key path to prefix the name of the token
 * @returns
 */
export const flatten = (
	nested: DeepKeyTokenMap,
	keyPath: string[] = []
): IResolvedToken[] => {
	return Object.entries(nested).reduce((acc, [key, val]) => {
		//Check if leaf node
		if (val && typeof val.value !== 'undefined') {
			const leaf = val as SingleToken;
			acc.push({
				name: [...keyPath, key].join('.'),
				value: leaf.value,
				type: leaf.type as TokenTypes,
				description: leaf.description
			});
			return acc;
		}

		//else continue recursing
		const flattened = flatten(val as DeepKeyTokenMap, [...keyPath, key]);
		acc = acc.concat(flattened);

		return acc;
	}, [] as IResolvedToken[]);
};

/**
 * Takes in an array of tokens and returns a map of tokens.
 * This only works if the tokens are flat, meaning they do not have nested tokens
 * @param tokens
 * @returns
 */
export const flatTokensToMap = (tokens: IResolvedToken[]) => {
	return tokens.reduce(
		(acc, token) => {
			acc[token.name] = token;
			return acc;
		},
		{} as Record<string, IResolvedToken>
	);
};

/**
 * Takes an array of tokens and returns a map of tokens. This does result in nested tokens
 * @param tokens
 * @returns
 */
export const flatTokensRestoreToMap = (tokens: IResolvedToken[]) => {
	const returning = {};
	tokens.forEach(token => {
		const { name, ...rest } = token;
		setProperty(returning, name, {
			...rest
		});
	});
	return returning;
};

export type W3CToken = {
	$value: string;
	$type: TokenTypes;
	alpha?: number;
	$extensions?: Record<string, unknown>;
};
export interface W3CDeepKeyTokenMap {
	[key: string]: W3CDeepKeyTokenMap | W3CToken;
}

export const convertW3CToStudio = (
	obj: W3CDeepKeyTokenMap
): DeepKeyTokenMap => {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (Object.hasOwn(value, '$value')) {
			const val = value as W3CToken;
			const newValue = {
				value: value.$value
			} as SingleToken;

			if (Object.hasOwn(value, '$type')) {
				//@ts-ignore
				newValue.type = val.$type;
			}
			acc[key] = newValue;
		} else {
			acc[key] = convertW3CToStudio(value as W3CDeepKeyTokenMap);
		}
		return acc;
	}, {} as DeepKeyTokenMap);
};
