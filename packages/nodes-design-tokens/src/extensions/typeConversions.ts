import {
	SchemaObject,
	canConvertSchemaTypes as baseCanConvertSchemaTypes,
	convertSchemaType as baseConvertSchemaType,
	getConversionDescription as baseGetConversionDescription,
	registerConversionExtension
} from '@tokens-studio/graph-engine';
import { TokenSchema, TokenSetSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import { flatTokensRestoreToMap, flatten } from '../utils/index.js';
import type { DeepKeyTokenMap, SingleToken } from '@tokens-studio/types';

/**
 * Extended conversion description generator for design tokens
 */
export const getConversionDescription = (
	srcSchema: SchemaObject,
	targetSchema: SchemaObject
): string => {
	const srcIsTokenArray = srcSchema.type === 'array' && srcSchema.items?.$id === TokenSchema.$id;
	const targetIsTokenArray = targetSchema.type === 'array' && targetSchema.items?.$id === TokenSchema.$id;

	// Design token specific descriptions
	if (srcIsTokenArray && targetSchema.$id === TokenSetSchema.$id) {
		return 'TOK[]→SET';
	}
	if (srcSchema.$id === TokenSetSchema.$id && targetIsTokenArray) {
		return 'SET→TOK[]';
	}
	if (srcSchema.$id === TokenSchema.$id && targetIsTokenArray) {
		return 'TOK→TOK[]';
	}

	// Fall back to base descriptions
	return baseGetConversionDescription(srcSchema, targetSchema);
};

/**
 * Extended type conversion checker that includes design token conversions
 */
export const canConvertSchemaTypes = (
	src: SchemaObject,
	target: SchemaObject
): boolean => {
	// Add design token specific conversions
	const srcIsTokenArray = src.type === 'array' && src.items?.$id === TokenSchema.$id;
	const targetIsTokenArray = target.type === 'array' && target.items?.$id === TokenSchema.$id;

	// Array of tokens to token set
	if (srcIsTokenArray && target.$id === TokenSetSchema.$id) {
		return true;
	}

	// Token set to array of tokens
	if (src.$id === TokenSetSchema.$id && targetIsTokenArray) {
		return true;
	}

	// Single token to array of tokens
	if (src.$id === TokenSchema.$id && targetIsTokenArray) {
		return true;
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
			// Use flatten to convert token set to array, then cast to SingleToken[]
			return flatten(src as DeepKeyTokenMap) as any;
		} catch (error) {
			console.warn('Failed to convert token set to token array:', error);
			return [];
		}
	}

	// Single token to array of tokens
	if (srcSchema.$id === TokenSchema.$id && targetIsTokenArray) {
		return [src];
	}

	// Return undefined to indicate no conversion was performed
	return undefined;
};

/**
 * Register the design token conversion extensions
 */
export const registerDesignTokenConversions = () => {
	registerConversionExtension({
		canConvertSchemaTypes,
		convertSchemaType,
		getConversionDescription
	});
};

// Auto-register when this module is imported
registerDesignTokenConversions();
