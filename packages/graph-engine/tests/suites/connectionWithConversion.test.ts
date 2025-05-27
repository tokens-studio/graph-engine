import { Graph } from '../../src/graph/graph.js';
import {
	NumberSchema,
	StringSchema,
	canConvertSchemaTypes
} from '../../src/schemas/index.js';
import { describe, expect, test } from 'vitest';
import ConstantNode from '../../src/nodes/generic/constant.js';
import TypeConverter from '../../src/nodes/generic/typeConverter.js';

describe('Connection with Type Conversion', () => {
	test('simulates the connection logic that would trigger automatic conversion', () => {
		const graph = new Graph();

		// Create source node (number constant)
		const sourceNode = new ConstantNode({ graph });
		sourceNode.inputs.value.setValue(42);
		sourceNode.inputs.value.setType(NumberSchema);
		sourceNode.outputs.value.setType(NumberSchema);

		// Create target node (string constant)
		const targetNode = new ConstantNode({ graph });
		targetNode.inputs.value.setType(StringSchema);
		targetNode.outputs.value.setType(StringSchema);

		// Simulate the connection logic check
		const sourceType = sourceNode.outputs.value.type;
		const targetType = targetNode.inputs.value.type;
		const needsConversion =
			sourceType.$id !== targetType.$id &&
			canConvertSchemaTypes(sourceType, targetType) &&
			sourceType.$id !== 'https://schemas.tokens.studio/any.json' &&
			targetType.$id !== 'https://schemas.tokens.studio/any.json';

		// Verify that conversion would be needed
		expect(needsConversion).toBe(true);
		expect(sourceType.$id).toBe('https://schemas.tokens.studio/number.json');
		expect(targetType.$id).toBe('https://schemas.tokens.studio/string.json');
	});

	test('verifies that same types do not trigger conversion', () => {
		const graph = new Graph();

		// Create two nodes with the same type
		const sourceNode = new ConstantNode({ graph });
		sourceNode.outputs.value.setType(NumberSchema);

		const targetNode = new ConstantNode({ graph });
		targetNode.inputs.value.setType(NumberSchema);

		// Simulate the connection logic check
		const sourceType = sourceNode.outputs.value.type;
		const targetType = targetNode.inputs.value.type;
		const needsConversion =
			sourceType.$id !== targetType.$id &&
			canConvertSchemaTypes(sourceType, targetType) &&
			sourceType.$id !== 'https://schemas.tokens.studio/any.json' &&
			targetType.$id !== 'https://schemas.tokens.studio/any.json';

		// Verify that conversion would NOT be needed
		expect(needsConversion).toBe(false);
		expect(sourceType.$id).toBe(targetType.$id);
	});

	test('verifies converter node positioning logic', () => {
		// Simulate React Flow node positions
		const sourcePosition = { x: 100, y: 100 };
		const targetPosition = { x: 300, y: 200 };

		// Calculate converter position (should be in the middle)
		const converterPosition = {
			x: (sourcePosition.x + targetPosition.x) / 2,
			y: (sourcePosition.y + targetPosition.y) / 2
		};

		expect(converterPosition.x).toBe(200);
		expect(converterPosition.y).toBe(150);
	});

	test('verifies full conversion chain execution', async () => {
		const graph = new Graph();

		// Create source node
		const sourceNode = new ConstantNode({ graph });
		sourceNode.inputs.value.setValue(123);
		sourceNode.inputs.value.setType(NumberSchema);
		sourceNode.outputs.value.setType(NumberSchema);

		// Create converter
		const converter = new TypeConverter({ graph });
		converter.setConversionTypes(NumberSchema, StringSchema);

		// Create target node
		const targetNode = new ConstantNode({ graph });
		targetNode.inputs.value.setType(StringSchema);
		targetNode.outputs.value.setType(StringSchema);

		// Connect the chain: source -> converter -> target
		graph.connect(
			sourceNode,
			sourceNode.outputs.value,
			converter,
			converter.inputs.value
		);
		graph.connect(
			converter,
			converter.outputs.value,
			targetNode,
			targetNode.inputs.value
		);

		// Execute the chain
		await sourceNode.execute();
		await converter.execute();
		await targetNode.execute();

		// Verify the conversion worked
		expect(sourceNode.outputs.value.value).toBe(123);
		expect(converter.outputs.value.value).toBe('123');
		expect(targetNode.outputs.value.value).toBe('123');

		// Verify the converter shows the right description
		expect(converter.getConversionDescription()).toBe('NUM→STR');
	});
});
