import { Graph } from '../../../../src/graph/graph.js';
import { Operator } from '../../../../src/schemas/operators.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/search/findFirst.js';

describe('search/findFirst', () => {
	test('finds first number greater than target', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 3, 5, 7, 9]);
		node.inputs.target.setValue(4);
		node.inputs.operator.setValue(Operator.GREATER_THAN);

		await node.execute();

		expect(node.outputs.value.value).toBe(5);
		expect(node.outputs.index.value).toBe(2);
		expect(node.outputs.found.value).toBe(true);
	});

	test('finds first number less than target', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([9, 7, 5, 3, 1]);
		node.inputs.target.setValue(6);
		node.inputs.operator.setValue(Operator.LESS_THAN);

		await node.execute();

		expect(node.outputs.value.value).toBe(5);
		expect(node.outputs.index.value).toBe(2);
		expect(node.outputs.found.value).toBe(true);
	});

	test('handles no match found', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3, 4, 5]);
		node.inputs.target.setValue(10);
		node.inputs.operator.setValue(Operator.GREATER_THAN);

		await node.execute();

		expect(node.outputs.value.value).toBe(null);
		expect(node.outputs.index.value).toBe(-1);
		expect(node.outputs.found.value).toBe(false);
	});

	test('works with empty array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([]);
		node.inputs.target.setValue(5);
		node.inputs.operator.setValue(Operator.GREATER_THAN);

		await node.execute();

		expect(node.outputs.value.value).toBe(null);
		expect(node.outputs.index.value).toBe(-1);
		expect(node.outputs.found.value).toBe(false);
	});
});
