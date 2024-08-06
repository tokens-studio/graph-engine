import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/inject.js';

describe('array/inject', () => {
	test('injects an item at a positive index', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3]);
		node.inputs.item.setValue(4);
		node.inputs.index.setValue(1);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 4, 2, 3]);
	});

	test('injects an item at the beginning with index 0', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3]);
		node.inputs.item.setValue(0);
		node.inputs.index.setValue(0);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0, 1, 2, 3]);
	});

	test('injects an item at the end with index equal to array length', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3]);
		node.inputs.item.setValue(4);
		node.inputs.index.setValue(3);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 2, 3, 4]);
	});

	test('injects an item at a negative index', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3]);
		node.inputs.item.setValue(4);
		node.inputs.index.setValue(-2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 2, 4, 3]);
	});

	test('injects an item at the beginning with a large negative index', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1, 2, 3]);
		node.inputs.item.setValue(0);
		node.inputs.index.setValue(-10);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0, 1, 2, 3]);
	});

	test('does not mutate the original array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const originalArray = [1, 2, 3];
		node.inputs.array.setValue(originalArray);
		node.inputs.item.setValue(4);
		node.inputs.index.setValue(1);

		await node.execute();

		expect(originalArray).to.eql([1, 2, 3]);
	});
});
