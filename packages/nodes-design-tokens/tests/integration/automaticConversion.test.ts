import '../../src/extensions/typeConversions.js';
import { Graph, nodeLookup } from '@tokens-studio/graph-engine';
import { TokenSchema, TokenSetSchema } from '../../src/schemas/index.js';
import { arrayOf } from '../../src/schemas/utils.js';
import { describe, expect, test } from 'vitest'; // Register extensions

const TypeConverter = nodeLookup['studio.tokens.generic.typeConverter'];

describe('Automatic Type Conversion Integration', () => {
	test('type converter can handle token array to token set conversion', async () => {
		const graph = new Graph();

		// Create a type converter for token array to token set
		const converter = new TypeConverter({ graph });
		const TokenArraySchema = arrayOf(TokenSchema);
		converter.setConversionTypes(TokenArraySchema, TokenSetSchema);

		// Set input token array
		const tokenArray = [
			{
				name: 'colors.primary',
				value: '#ff0000',
				type: 'color'
			},
			{
				name: 'spacing.small',
				value: '8px',
				type: 'dimension'
			}
		];

		converter.inputs.value.setValue(tokenArray);

		// Execute conversion
		await converter.execute();

		// Verify output
		const result = converter.outputs.value.value;
		expect(result).toEqual({
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

		// Verify conversion description
		expect(converter.getConversionDescription()).toBe('TOK[]→SET');
	});

	test('single token to array conversion works', async () => {
		const graph = new Graph();

		const converter = new TypeConverter({ graph });
		const TokenArraySchema = arrayOf(TokenSchema);
		converter.setConversionTypes(TokenSchema, TokenArraySchema);

		const singleToken = {
			name: 'colors.primary',
			value: '#ff0000',
			type: 'color'
		};

		converter.inputs.value.setValue(singleToken);
		await converter.execute();

		const result = converter.outputs.value.value;
		expect(result).toEqual([singleToken]);
		expect(converter.getConversionDescription()).toBe('TOK→TOK[]');
	});
});
