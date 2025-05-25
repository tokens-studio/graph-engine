import {
	SchemaObject,
	canConvertSchemaTypes as baseCanConvertSchemaTypes,
	convertSchemaType as baseConvertSchemaType
} from '@tokens-studio/graph-engine';
import { TokenSchema, TokenSetSchema } from './index.js';
import { arrayOf } from './utils.js';
import { flatTokensRestoreToMap } from '../utils/index.js';
import type { SingleToken } from '@tokens-studio/types';

// Define the token array schema
export const TOKEN_ARRAY = 'https://schemas.tokens.studio/tokenArray.json';
export const TokenArraySchema: SchemaObject = arrayOf(TokenSchema);

/**
 * Extended type conversion checker that includes design token conversions
 */
export const canConvertSchemaTypes = (
	src: SchemaObject,
	target: SchemaObject
): boolean => {
	// First check the base conversions
	if (baseCanConvertSchemaTypes(src, target)) {
		return true;
	}

	// Add design token specific conversions
	switch (src.$id || (src.type === 'array' && src.items?.$id)) {
		case TokenSchema.$id:
			// Single token to array of tokens
			if (target.type === 'array' && target.items?.$id === TokenSchema.$id) {
				return true;
			}
			break;
		case TokenSchema.$id: // When src is array of tokens
			if (src.type === 'array' && src.items?.$id === TokenSchema.$id) {
				switch (target.$id) {
					case TokenSetSchema.$id:
						return true; // Array of tokens to token set
				}
			}
			break;
		case TokenSetSchema.$id:
			// Token set to array of tokens
			if (target.type === 'array' && target.items?.$id === TokenSchema.$id) {
				return true;
			}
			break;
	}

	return false;
};

/**
 * Extended type converter that includes design token conversions
 */
export const convertSchemaType = (
	srcSchema: SchemaObject,
	targetSchema: SchemaObject,
	src: any
): any => {
	// First try the base conversions
	const baseResult = baseConvertSchemaType(srcSchema, targetSchema, src);
	if (baseResult !== src) {
		return baseResult; // Base conversion handled it
	}

	// Handle design token specific conversions
	const srcIsTokenArray = srcSchema.type === 'array' && srcSchema.items?.$id === TokenSchema.$id;
	const targetIsTokenArray = targetSchema.type === 'array' && targetSchema.items?.$id === TokenSchema.$id;

	// Array of tokens to token set
	if (srcIsTokenArray && targetSchema.$id === TokenSetSchema.$id) {
		try {
			// Cast SingleToken[] to IResolvedToken[] as done in existing nodes
			return flatTokensRestoreToMap(src as any);
		} catch (error) {
			console.warn('Failed to convert token array to token set:', error);
			return {};
		}
	}

	// Token set to array of tokens
	if (srcSchema.$id === TokenSetSchema.$id && targetIsTokenArray) {
		try {
			// This is just a placeholder - the real implementation is in extensions/typeConversions.ts
			return [];
		} catch (error) {
			console.warn('Failed to convert token set to token array:', error);
			return [];
		}
	}

	// Single token to array of tokens
	if (srcSchema.$id === TokenSchema.$id && targetIsTokenArray) {
		return [src];
	}

	// No conversion available, return original
	return src;
};
