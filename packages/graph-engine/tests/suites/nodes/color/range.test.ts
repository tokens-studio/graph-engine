import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import { toColor } from '../../../../src/nodes/color/lib/utils.js';
import Node from '../../../../src/nodes/color/range.js';

describe('Color Range Node', () => {
	const createNode = () => {
		const graph = new Graph();
		return new Node({ graph });
	};

	test('should generate correct number of steps', () => {
		const node = createNode();

		// Test with 3 steps
		node.inputs.colorA.setValue({ space: 'srgb', channels: [1, 0, 0] }); // Red
		node.inputs.colorB.setValue({ space: 'srgb', channels: [0, 0, 1] }); // Blue
		node.inputs.steps.setValue(3);
		node.execute();

		const colors = node.outputs.colors.value;
		expect(colors).toHaveLength(3);

		// Test with 5 steps
		node.inputs.steps.setValue(5);
		node.execute();
		expect(node.outputs.colors.value).toHaveLength(5);
	});

	test('should handle different color spaces correctly', () => {
		const node = createNode();
		const colorA = { space: 'srgb', channels: [1, 0, 0] }; // Red
		const colorB = { space: 'srgb', channels: [0, 0, 1] }; // Blue

		node.inputs.colorA.setValue(colorA);
		node.inputs.colorB.setValue(colorB);
		node.inputs.steps.setValue(3);

		// Test different spaces
		const spaces = ['lab', 'lch', 'srgb', 'hsl'];
		spaces.forEach(space => {
			node.inputs.space.setValue(space);
			node.execute();

			const colors = node.outputs.colors.value;
			expect(colors).toHaveLength(3);
			expect(colors[0]).toMatchObject(colorA);
			expect(colors[2]).toMatchObject(colorB);
		});
	});

	test('should apply progression curves properly', () => {
		const node = createNode();

		node.inputs.colorA.setValue({ space: 'srgb', channels: [0, 0, 0] }); // Black
		node.inputs.colorB.setValue({ space: 'srgb', channels: [1, 1, 1] }); // White
		node.inputs.steps.setValue(3);

		// Test linear progression
		node.inputs.progression.setValue('linear');
		node.execute();
		const linearColors = node.outputs.colors.value;

		// Test quadratic progression
		node.inputs.progression.setValue('quadratic');
		node.execute();
		const quadraticColors = node.outputs.colors.value;

		// Middle color should be darker in quadratic progression
		const linearMiddle = toColor(linearColors[1]);
		const quadraticMiddle = toColor(quadraticColors[1]);
		expect(linearMiddle.oklch.l).toBeGreaterThan(quadraticMiddle.oklch.l);
	});

	test('should handle hue interpolation methods correctly', () => {
		const node = createNode();

		// Use colors with distinctly different hues
		node.inputs.colorA.setValue({ space: 'hsl', channels: [0, 100, 50] }); // Red
		node.inputs.colorB.setValue({ space: 'hsl', channels: [240, 100, 50] }); // Blue
		node.inputs.steps.setValue(3);
		node.inputs.space.setValue('hsl');

		// Test different hue methods
		const hueMethods = ['shorter', 'longer', 'increasing', 'decreasing'];
		const results = hueMethods.map(method => {
			node.inputs.hue.setValue(method);
			node.execute();
			return node.outputs.colors.value[1].channels[0]; // Get middle color's hue
		});

		// Verify that different hue methods produce different results
		const uniqueHues = new Set(results);
		expect(uniqueHues.size).toBeGreaterThan(1);
	});

	test('should maintain alpha values', () => {
		const node = createNode();

		// Test with transparent colors
		node.inputs.colorA.setValue({
			space: 'srgb',
			channels: [1, 0, 0],
			alpha: 0.5
		});
		node.inputs.colorB.setValue({
			space: 'srgb',
			channels: [0, 0, 1],
			alpha: 1
		});
		node.inputs.steps.setValue(3);
		node.execute();

		const colors = node.outputs.colors.value;
		expect(colors[0].alpha).toBe(0.5);
		expect(colors[1].alpha).toBe(0.75);
		expect(colors[2].alpha).toBe(1);
	});

	test('should handle edge cases', () => {
		const node = createNode();

		// Test with same colors
		const sameColor = { space: 'srgb', channels: [1, 0, 0] };
		node.inputs.colorA.setValue(sameColor);
		node.inputs.colorB.setValue(sameColor);
		node.inputs.steps.setValue(3);
		node.execute();

		const colors = node.outputs.colors.value;
		expect(colors).toHaveLength(3);
		colors.forEach(color => {
			expect(color).toMatchObject(sameColor);
		});

		// Test with minimum steps
		node.inputs.steps.setValue(2);
		node.execute();
		expect(node.outputs.colors.value).toHaveLength(2);
	});

	test('should preserve color space of input colors', () => {
		const node = createNode();

		const hslColor = { space: 'hsl', channels: [0, 100, 50] };
		const labColor = { space: 'lab', channels: [50, 50, 0] };

		node.inputs.colorA.setValue(hslColor);
		node.inputs.colorB.setValue(labColor);
		node.inputs.steps.setValue(3);
		node.execute();

		const colors = node.outputs.colors.value;
		expect(colors[0].space).toBe(hslColor.space);
		expect(colors[2].space).toBe(labColor.space);
	});
});
