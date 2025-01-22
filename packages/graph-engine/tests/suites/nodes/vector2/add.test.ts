import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/vector2/add.js';

describe('vector2/add', () => {
	test('adds two vectors', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a: [number, number] = [1, 2];
		const b: [number, number] = [3, 4];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		const actual = node.outputs.value.value;
		expect(actual).to.eql([4, 6]);
		// Ensure original vectors weren't modified
		expect(a).to.eql([1, 2]);
		expect(b).to.eql([3, 4]);
	});

	test('handles zero vector', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a: [number, number] = [1, 2];
		const b: [number, number] = [0, 0];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		expect(node.outputs.value.value).to.eql([1, 2]);
	});

	test('handles negative components', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a: [number, number] = [-1, 2];
		const b: [number, number] = [3, -4];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		expect(node.outputs.value.value).to.eql([2, -2]);
	});
});
