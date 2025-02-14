import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/vector2/length.js';

describe('vector2/length', () => {
	test('calculates length of vector', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [3, 4];
		node.inputs.vector.setValue(vector);

		await node.execute();

		const actual = node.outputs.value.value;
		// Length of [3,4] should be 5 (Pythagorean triple)
		expect(actual).to.equal(5);
		// Ensure original vector wasn't modified
		expect(vector).to.eql([3, 4]);
	});

	test('handles zero vector', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [0, 0];
		node.inputs.vector.setValue(vector);

		await node.execute();

		expect(node.outputs.value.value).to.equal(0);
	});

	test('handles unit vector', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Unit vector along x-axis
		const vector: [number, number] = [1, 0];
		node.inputs.vector.setValue(vector);

		await node.execute();

		expect(node.outputs.value.value).to.equal(1);
	});

	test('handles negative components', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [-3, -4];
		node.inputs.vector.setValue(vector);

		await node.execute();

		// Length should be same as positive components
		expect(node.outputs.value.value).to.equal(5);
	});
});
