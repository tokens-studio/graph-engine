import '../../src/extensions/typeConversions.js';
import { Graph, canConvertSchemaTypesExtended, convertSchemaTypeExtended, nodeLookup } from '@tokens-studio/graph-engine';
import { TokenSchema, TokenSetSchema } from '../../src/schemas/index.js';
import { arrayOf } from '../../src/schemas/utils.js';
import { describe, expect, test } from 'vitest'; // Register extensions

const TypeConverter = nodeLookup['studio.tokens.generic.typeConverter'];

describe('End-to-End Type Conversion', () => {
	test('complete workflow: token set → array → token set with type converters', async () => {
		const graph = new Graph();
		
		// Original token set
		const originalTokenSet = {
			colors: {
				primary: {
					value: '#ff0000',
					type: 'color'
				},
				secondary: {
					value: '#00ff00',
					type: 'color'
				}
			},
			spacing: {
				small: {
					value: '8px',
					type: 'dimension'
				},
				medium: {
					value: '16px',
					type: 'dimension'
				}
			}
		};
		
		// Step 1: Convert token set to array using type converter
		const setToArrayConverter = new TypeConverter({ graph });
		const TokenArraySchema = arrayOf(TokenSchema);
		setToArrayConverter.setConversionTypes(TokenSetSchema, TokenArraySchema);
		
		setToArrayConverter.inputs.value.setValue(originalTokenSet);
		await setToArrayConverter.execute();
		
		const tokenArray = setToArrayConverter.outputs.value.value;
		
		// Verify array conversion
		expect(Array.isArray(tokenArray)).toBe(true);
		expect(tokenArray.length).toBe(4); // 2 colors + 2 spacing tokens
		expect(setToArrayConverter.getConversionDescription()).toBe('SET→TOK[]');
		
		// Verify token names are correct
		const tokenNames = tokenArray.map(token => token.name);
		expect(tokenNames).toContain('colors.primary');
		expect(tokenNames).toContain('colors.secondary');
		expect(tokenNames).toContain('spacing.small');
		expect(tokenNames).toContain('spacing.medium');
		
		// Step 2: Convert array back to token set using type converter
		const arrayToSetConverter = new TypeConverter({ graph });
		arrayToSetConverter.setConversionTypes(TokenArraySchema, TokenSetSchema);
		
		arrayToSetConverter.inputs.value.setValue(tokenArray);
		await arrayToSetConverter.execute();
		
		const finalTokenSet = arrayToSetConverter.outputs.value.value;
		
		// Verify round-trip conversion
		expect(finalTokenSet).toEqual(originalTokenSet);
		expect(arrayToSetConverter.getConversionDescription()).toBe('TOK[]→SET');
	});

	test('type compatibility checking works correctly', () => {
		const TokenArraySchema = arrayOf(TokenSchema);
		
		// These should be compatible
		expect(canConvertSchemaTypesExtended(TokenArraySchema, TokenSetSchema)).toBe(true);
		expect(canConvertSchemaTypesExtended(TokenSetSchema, TokenArraySchema)).toBe(true);
		expect(canConvertSchemaTypesExtended(TokenSchema, TokenArraySchema)).toBe(true);
		
		// Same types should be compatible (but won't need conversion)
		expect(canConvertSchemaTypesExtended(TokenSchema, TokenSchema)).toBe(true);
		expect(canConvertSchemaTypesExtended(TokenSetSchema, TokenSetSchema)).toBe(true);
		expect(canConvertSchemaTypesExtended(TokenArraySchema, TokenArraySchema)).toBe(true);
	});

	test('direct conversion functions work correctly', () => {
		const TokenArraySchema = arrayOf(TokenSchema);
		
		// Test token array to token set
		const tokenArray = [
			{ name: 'colors.primary', value: '#ff0000', type: 'color' },
			{ name: 'spacing.small', value: '8px', type: 'dimension' }
		];
		
		const tokenSet = convertSchemaTypeExtended(TokenArraySchema, TokenSetSchema, tokenArray);
		
		expect(tokenSet).toEqual({
			colors: {
				primary: {
					value: '#ff0000',
					type: 'color'
				}
			},
			spacing: {
				small: {
					value: '8px',
					type: 'dimension'
				}
			}
		});
		
		// Test token set to token array
		const backToArray = convertSchemaTypeExtended(TokenSetSchema, TokenArraySchema, tokenSet);
		
		expect(Array.isArray(backToArray)).toBe(true);
		expect(backToArray.length).toBe(2);
		
		const names = backToArray.map(token => token.name);
		expect(names).toContain('colors.primary');
		expect(names).toContain('spacing.small');
	});

	test('single token to array conversion', () => {
		const TokenArraySchema = arrayOf(TokenSchema);
		const singleToken = { name: 'colors.primary', value: '#ff0000', type: 'color' };
		
		const result = convertSchemaTypeExtended(TokenSchema, TokenArraySchema, singleToken);
		
		expect(result).toEqual([singleToken]);
	});

	test('handles complex nested token structures', async () => {
		const graph = new Graph();
		const converter = new TypeConverter({ graph });
		const TokenArraySchema = arrayOf(TokenSchema);
		
		// Complex nested structure
		const complexTokenSet = {
			design: {
				system: {
					colors: {
						brand: {
							primary: {
								value: '#007bff',
								type: 'color'
							},
							secondary: {
								value: '#6c757d',
								type: 'color'
							}
						}
					},
					typography: {
						heading: {
							large: {
								value: '32px',
								type: 'dimension'
							}
						}
					}
				}
			}
		};
		
		converter.setConversionTypes(TokenSetSchema, TokenArraySchema);
		converter.inputs.value.setValue(complexTokenSet);
		await converter.execute();
		
		const result = converter.outputs.value.value;
		
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBe(3);
		
		const tokenNames = result.map(token => token.name);
		expect(tokenNames).toContain('design.system.colors.brand.primary');
		expect(tokenNames).toContain('design.system.colors.brand.secondary');
		expect(tokenNames).toContain('design.system.typography.heading.large');
	});
});
