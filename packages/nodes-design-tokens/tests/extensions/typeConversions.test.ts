import '../../src/extensions/typeConversions.js';
import { Graph, canConvertSchemaTypesExtended, convertSchemaTypeExtended, getConversionDescriptionExtended } from '@tokens-studio/graph-engine';
import { TokenSchema, TokenSetSchema } from '../../src/schemas/index.js';
import { arrayOf } from '../../src/schemas/utils.js';
import { beforeAll, describe, expect, test } from 'vitest'; // Import to register extensions

describe('Design Token Type Conversions', () => {
	const TokenArraySchema = arrayOf(TokenSchema);
	
	test('can convert token array to token set', () => {
		expect(canConvertSchemaTypesExtended(TokenArraySchema, TokenSetSchema)).toBe(true);
	});

	test('can convert token set to token array', () => {
		expect(canConvertSchemaTypesExtended(TokenSetSchema, TokenArraySchema)).toBe(true);
	});

	test('can convert single token to token array', () => {
		expect(canConvertSchemaTypesExtended(TokenSchema, TokenArraySchema)).toBe(true);
	});

	test('converts token array to token set correctly', () => {
		const tokenArray = [
			{
				name: 'colors.primary',
				value: '#ff0000',
				type: 'color'
			},
			{
				name: 'colors.secondary',
				value: '#00ff00',
				type: 'color'
			}
		];

		const result = convertSchemaTypeExtended(TokenArraySchema, TokenSetSchema, tokenArray);
		
		expect(result).toEqual({
			colors: {
				primary: {
					value: '#ff0000',
					type: 'color'
				},
				secondary: {
					value: '#00ff00',
					type: 'color'
				}
			}
		});
	});

	test('converts single token to token array correctly', () => {
		const token = {
			name: 'colors.primary',
			value: '#ff0000',
			type: 'color'
		};

		const result = convertSchemaTypeExtended(TokenSchema, TokenArraySchema, token);
		
		expect(result).toEqual([token]);
	});

	test('provides correct conversion descriptions', () => {
		expect(getConversionDescriptionExtended(TokenArraySchema, TokenSetSchema)).toBe('TOK[]→SET');
		expect(getConversionDescriptionExtended(TokenSetSchema, TokenArraySchema)).toBe('SET→TOK[]');
		expect(getConversionDescriptionExtended(TokenSchema, TokenArraySchema)).toBe('TOK→TOK[]');
	});

	test('handles conversion errors gracefully', () => {
		// Test with invalid token array
		const invalidTokenArray = [{ invalid: 'data' }];
		
		const result = convertSchemaTypeExtended(TokenArraySchema, TokenSetSchema, invalidTokenArray);
		
		// Should return empty object on error
		expect(result).toEqual({});
	});
});
