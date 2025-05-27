import { Graph } from '../../src/graph/graph.js';
import {
	NumberSchema,
	StringSchema,
	canConvertSchemaTypes,
	convertSchemaType
} from '../../src/schemas/index.js';
import { describe, expect, test } from 'vitest';
import TypeConverter from '../../src/nodes/generic/typeConverter.js';

describe('Type Converter', () => {
	test('can convert number to string', () => {
		const result = convertSchemaType(NumberSchema, StringSchema, 42);
		expect(result).toBe('42');
	});

	test('can check type compatibility', () => {
		expect(canConvertSchemaTypes(NumberSchema, StringSchema)).toBe(true);
		expect(canConvertSchemaTypes(StringSchema, NumberSchema)).toBe(true);
	});

	test('type converter node works correctly', async () => {
		const graph = new Graph();
		const converter = new TypeConverter({ graph });

		// Set up conversion from number to string
		converter.setConversionTypes(NumberSchema, StringSchema);

		// Set input value
		converter.inputs.value.setValue(123);

		// Execute the node
		await converter.execute();

		// Check output
		expect(converter.outputs.value.value).toBe('123');
		expect(converter.getConversionDescription()).toBe('NUM→STR');
	});
});
