import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/search/linear.js';

describe('search/linear', () => {
	test('finds exact match in array of numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3, 4, 5]);
		node.inputs.target.setValue(3);

		await node.execute();

		expect(node.outputs.index.value).toBe(2);
		expect(node.outputs.found.value).toBe(true);
	});

	test('finds exact match in array of objects', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const array = [
			{ id: 1, value: 'a' },
			{ id: 2, value: 'b' },
			{ id: 3, value: 'c' }
		];

		node.inputs.array.setValue(array);
		node.inputs.target.setValue({ id: 2, value: 'b' });

		await node.execute();

		expect(node.outputs.index.value).toBe(1);
		expect(node.outputs.found.value).toBe(true);
	});

	test('handles no match found', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3, 4, 5]);
		node.inputs.target.setValue(6);

		await node.execute();

		expect(node.outputs.index.value).toBe(-1);
		expect(node.outputs.found.value).toBe(false);
	});

	test('handles empty array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([]);
		node.inputs.target.setValue(1);

		await node.execute();

		expect(node.outputs.index.value).toBe(-1);
		expect(node.outputs.found.value).toBe(false);
	});
});
