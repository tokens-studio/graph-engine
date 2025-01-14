import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/vector2/dot.js';

describe('vector2/dot', () => {
	test('calculates dot product of two vectors', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a: [number, number] = [1, 2];
		const b: [number, number] = [3, 4];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		const actual = node.outputs.value.value;
		// (1 * 3) + (2 * 4) = 3 + 8 = 11
		expect(actual).to.equal(11);
		// Ensure original vectors weren't modified
		expect(a).to.eql([1, 2]);
		expect(b).to.eql([3, 4]);
	});

	test('handles perpendicular vectors', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a: [number, number] = [1, 0];
		const b: [number, number] = [0, 1];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		// Perpendicular vectors should have dot product of 0
		expect(node.outputs.value.value).to.equal(0);
	});

	test('handles parallel vectors', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a: [number, number] = [2, 0];
		const b: [number, number] = [3, 0];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		// Parallel vectors should have dot product equal to product of their lengths
		expect(node.outputs.value.value).to.equal(6);
	});

	test('handles zero vector', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a: [number, number] = [1, 2];
		const b: [number, number] = [0, 0];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		expect(node.outputs.value.value).to.equal(0);
	});
});
