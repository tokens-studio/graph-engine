import { Color } from '../../../../src/index.js';
import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import { getAllOutputs } from '../../../../src/utils/node.js';
import Node, {
	ColorVisionType
} from '../../../../src/nodes/accessibility/colorCorrection.js';

describe('accessibility/colorCorrection', () => {
	test('should simulate protanopia color vision', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const originalColor: Color = {
			space: 'srgb',
			channels: [1, 0, 0] as [number, number, number] // Pure red
		};

		node.inputs.color.setValue(originalColor);
		node.inputs.type.setValue(ColorVisionType.PROTANOPIA);
		node.inputs.strength.setValue(1);

		await node.run();

		const output = getAllOutputs(node);
		const colorOutput = output.value as Color;

		expect(colorOutput.space).toBe('srgb');
		expect(colorOutput.channels).toHaveLength(3);

		// Protanopia should perceive red closer to a dark yellow/brown
		expect(colorOutput.channels[0]).toBeCloseTo(colorOutput.channels[1], 1); // R and G should be similar
		expect(colorOutput.channels[2]).toBeCloseTo(0, 1); // B should be low

		// Ensure the color has been modified
		expect(colorOutput).not.toEqual(originalColor);
	});

	test('should simulate deuteranopia color vision', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const originalColor: Color = {
			space: 'srgb',
			channels: [0, 1, 0] as [number, number, number] // Pure green
		};

		node.inputs.color.setValue(originalColor);
		node.inputs.type.setValue(ColorVisionType.DEUTERANOPIA);
		node.inputs.strength.setValue(1);

		await node.run();

		const output = getAllOutputs(node);
		const colorOutput = output.value as Color;

		expect(colorOutput.space).toBe('srgb');
		expect(colorOutput.channels).toHaveLength(3);

		// Deuteranopia should perceive green closer to a yellowish color
		expect(colorOutput.channels[0]).toBeCloseTo(colorOutput.channels[1], 1); // R and G should be similar
		expect(colorOutput.channels[2]).toBeCloseTo(0, 1); // B should be low

		// Ensure the color has been modified
		expect(colorOutput).not.toEqual(originalColor);
	});

	test('should simulate tritanopia color vision', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const originalColor: Color = {
			space: 'srgb',
			channels: [0, 0, 1] as [number, number, number] // Pure blue
		};

		node.inputs.color.setValue(originalColor);
		node.inputs.type.setValue(ColorVisionType.TRITANOPIA);
		node.inputs.strength.setValue(1);

		await node.run();

		const output = getAllOutputs(node);
		const colorOutput = output.value as Color;

		expect(colorOutput.space).toBe('srgb');
		expect(colorOutput.channels).toHaveLength(3);

		// Tritanopia affects blue perception, so blue should be modified
		expect(colorOutput).not.toEqual(originalColor);

		// Blue should appear more greenish in tritanopia
		expect(colorOutput.channels[1]).toBeGreaterThan(0.04); // Some green component
	});

	test('should simulate grayscale vision', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const originalColor: Color = {
			space: 'srgb',
			channels: [1, 0, 0] as [number, number, number] // Red
		};

		node.inputs.color.setValue(originalColor);
		node.inputs.type.setValue(ColorVisionType.GRAYSCALE);
		node.inputs.strength.setValue(1);

		await node.run();

		const output = getAllOutputs(node);
		const colorOutput = output.value as Color;

		expect(colorOutput.space).toBe('srgb');
		expect(colorOutput.channels).toHaveLength(3);

		// In grayscale, all RGB components should be nearly equal
		expect(colorOutput.channels[0]).toBeCloseTo(colorOutput.channels[1], 5);
		expect(colorOutput.channels[1]).toBeCloseTo(colorOutput.channels[2], 5);

		// The gray value should be approximately 0.299 for red (NTSC coefficient)
		const expectedGray = 0.299;
		expect(colorOutput.channels[0]).toBeCloseTo(expectedGray, 1);
	});

	test('should respect the strength parameter', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const originalColor: Color = {
			space: 'srgb',
			channels: [1, 0, 0] as [number, number, number] // Red
		};

		// First test with strength = 1 (full simulation)
		node.inputs.color.setValue(originalColor);
		node.inputs.type.setValue(ColorVisionType.DEUTERANOPIA);
		node.inputs.strength.setValue(1);

		await node.run();

		const outputStrong = getAllOutputs(node);
		const colorStrong = outputStrong.value as Color;

		// Now test with strength = 0 (no simulation)
		node.inputs.strength.setValue(0);
		await node.run();

		const outputZero = getAllOutputs(node);
		const colorZero = outputZero.value as Color;

		// Verify that strength parameter has an effect
		expect(colorZero).not.toEqual(colorStrong);

		// Test with strength = 0.5 (partial simulation)
		node.inputs.strength.setValue(0.5);
		await node.run();

		const outputHalf = getAllOutputs(node);
		const colorHalf = outputHalf.value as Color;

		// With strength=0.5, values should be different from both 0 and 1
		expect(colorHalf).not.toEqual(colorZero);
		expect(colorHalf).not.toEqual(colorStrong);
	});

	test('should preserve color space of input', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test with a non-sRGB color space
		const originalColor: Color = {
			space: 'hsl',
			channels: [0, 1, 0.5] as [number, number, number] // Red in HSL
		};

		node.inputs.color.setValue(originalColor);
		node.inputs.type.setValue(ColorVisionType.PROTANOPIA);
		node.inputs.strength.setValue(1);

		await node.run();

		const output = getAllOutputs(node);
		const colorOutput = output.value as Color;

		// Output should be in the same color space as input
		expect(colorOutput.space).toBe('hsl');
	});

	test('should produce known values for specific colors', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test medium blue to deuteranopia
		const blueColor: Color = {
			space: 'srgb',
			channels: [0.2, 0.4, 0.8] as [number, number, number]
		};

		node.inputs.color.setValue(blueColor);
		node.inputs.type.setValue(ColorVisionType.DEUTERANOPIA);
		node.inputs.strength.setValue(1);

		await node.run();

		const blueOutput = getAllOutputs(node);
		const blueColorOutput = blueOutput.value as Color;

		// In deuteranopia, this blue should have R and G channels approximately equal
		// and maintain a similar blue component
		expect(
			Math.abs(blueColorOutput.channels[0] - blueColorOutput.channels[1])
		).toBeLessThan(0.15);

		// Test yellow to grayscale
		const yellowColor: Color = {
			space: 'srgb',
			channels: [1, 1, 0] as [number, number, number]
		};

		node.inputs.color.setValue(yellowColor);
		node.inputs.type.setValue(ColorVisionType.GRAYSCALE);
		node.inputs.strength.setValue(1);

		await node.run();

		const yellowOutput = getAllOutputs(node);
		const yellowColorOutput = yellowOutput.value as Color;

		// Using NTSC luminance formula: Y = 0.299*R + 0.587*G + 0.114*B
		// For yellow (1,1,0), the grayscale value should be approximately 0.886
		const expectedGray = 0.299 * 1 + 0.587 * 1 + 0.114 * 0;
		expect(yellowColorOutput.channels[0]).toBeCloseTo(expectedGray, 1);
		expect(yellowColorOutput.channels[1]).toBeCloseTo(expectedGray, 1);
		expect(yellowColorOutput.channels[2]).toBeCloseTo(expectedGray, 1);
	});
});
