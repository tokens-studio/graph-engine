import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/math/closestNumber.js';

describe('math/closestNumber', () => {
	test('finds exact match', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.numbers.setValue([1, 2, 3, 4, 5]);
		node.inputs.target.setValue(3);

		await node.execute();

		expect(node.outputs.index.value).toBe(2);
		expect(node.outputs.value.value).toBe(3);
		expect(node.outputs.difference.value).toBe(0);
	});

	test('finds closest number when no exact match', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.numbers.setValue([1, 2, 4, 5]);
		node.inputs.target.setValue(3);

		await node.execute();

		expect(node.outputs.index.value).toBe(1);
		expect(node.outputs.value.value).toBe(2);
		expect(node.outputs.difference.value).toBe(1);
	});

	test('handles negative numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.numbers.setValue([-5, -2, 0, 2, 5]);
		node.inputs.target.setValue(-1);

		await node.execute();

		expect(node.outputs.index.value).toBe(1);
		expect(node.outputs.value.value).toBe(-2);
		expect(node.outputs.difference.value).toBe(1);
	});

	test('throws error for empty array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.numbers.setValue([]);
		node.inputs.target.setValue(1);

		await expect(node.execute()).rejects.toThrow('Input array cannot be empty');
	});
});
