import { ContrastAlgorithm } from '../../../../src/types/index.js';
import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/color/contrastingFromArray.js';

describe('color/contrastingFromArray', () => {
	test('should return the first color that meets the contrast threshold with WCAG 3', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.colors.setValue([
			{
				space: 'srgb',
				channels: [0.5, 0.5, 0.5]
			},
			{
				space: 'srgb',
				channels: [0, 0, 0]
			},
			{
				space: 'srgb',
				channels: [1, 1, 1]
			}
		]);
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [1, 1, 1]
		});
		node.inputs.algorithm.setValue(ContrastAlgorithm.APCA);
		node.inputs.threshold.setValue(100);

		node.execute();

		expect(node.outputs.color.value).toEqual({
			space: 'srgb',
			channels: [0, 0, 0]
		});
		expect(node.outputs.sufficient.value).toBe(true);
		expect(node.outputs.contrast.value).toBeCloseTo(106.04, 2);
		expect(node.outputs.index.value).toBe(1);
	});

	test('should return the highest contrast color when none meet threshold', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.colors.setValue([
			{
				space: 'srgb',
				channels: [0.87, 0.87, 0.87]
			},
			{
				space: 'srgb',
				channels: [0.73, 0.73, 0.73]
			}
		]);
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [1, 1, 1]
		});
		node.inputs.algorithm.setValue(ContrastAlgorithm.APCA);
		node.inputs.threshold.setValue(60);

		node.execute();

		expect(node.outputs.color.value).toEqual({
			space: 'srgb',
			channels: [0.73, 0.73, 0.73]
		});
		expect(node.outputs.sufficient.value).toBe(false);
		expect(node.outputs.contrast.value).toBeCloseTo(37.18, 2);
		expect(node.outputs.index.value).toBe(1);
	});

	test('should work with WCAG 2 algorithm', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.colors.setValue([
			{
				space: 'srgb',
				channels: [0.5, 0.5, 0.5]
			},
			{
				space: 'srgb',
				channels: [1, 1, 1]
			},
			{
				space: 'srgb',
				channels: [0, 0, 0]
			}
		]);
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [0, 0, 0]
		});
		node.inputs.algorithm.setValue(ContrastAlgorithm.WCAG21);
		node.inputs.threshold.setValue(8);

		node.execute();

		expect(node.outputs.color.value).toEqual({
			space: 'srgb',
			channels: [1, 1, 1]
		});
		expect(node.outputs.sufficient.value).toBe(true);
		expect(node.outputs.contrast.value).toBe(21);
		expect(node.outputs.index.value).toBe(1);
	});

	test('should handle different color spaces', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.colors.setValue([
			{
				space: 'lab',
				channels: [0, 0, 0]
			},
			{
				space: 'srgb',
				channels: [1, 1, 1]
			},
			{
				space: 'hsl',
				channels: [0, 0.5, 1]
			}
		]);
		node.inputs.background.setValue({
			space: 'hsl',
			channels: [0, 0.5, 1]
		});
		node.inputs.algorithm.setValue(ContrastAlgorithm.APCA);
		node.inputs.threshold.setValue(60);

		node.execute();

		expect(node.outputs.sufficient.value).toBe(true);
		expect(node.outputs.index.value).toBe(1);
	});

	test('should handle empty array input', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.colors.setValue([]);
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [1, 1, 1]
		});
		node.inputs.algorithm.setValue(ContrastAlgorithm.APCA);
		node.inputs.threshold.setValue(60);

		expect(() => node.execute()).toThrow('No colors provided');
	});
});
