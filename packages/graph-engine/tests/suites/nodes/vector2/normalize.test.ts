import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/vector2/normalize.js';

describe('vector2/normalize', () => {
	test('normalizes vector to unit length', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [3, 4];
		node.inputs.vector.setValue(vector);

		await node.execute();

		const actual = node.outputs.value.value;
		// [3,4] normalized should be [3/5, 4/5]
		expect(actual[0]).to.be.closeTo(0.6, 0.0001);
		expect(actual[1]).to.be.closeTo(0.8, 0.0001);
		// Ensure original vector wasn't modified
		expect(vector).to.eql([3, 4]);

		// Verify length is 1
		const length = Math.sqrt(actual[0] * actual[0] + actual[1] * actual[1]);
		expect(length).to.be.closeTo(1, 0.0001);
	});

	test('handles zero vector', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [0, 0];
		node.inputs.vector.setValue(vector);

		await node.execute();

		// Zero vector should remain zero when normalized
		expect(node.outputs.value.value).to.eql([0, 0]);
	});

	test('handles unit vector', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Already a unit vector
		const vector: [number, number] = [1, 0];
		node.inputs.vector.setValue(vector);

		await node.execute();

		const actual = node.outputs.value.value;
		expect(actual[0]).to.be.closeTo(1, 0.0001);
		expect(actual[1]).to.be.closeTo(0, 0.0001);
	});

	test('handles negative components', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [-3, -4];
		node.inputs.vector.setValue(vector);

		await node.execute();

		const actual = node.outputs.value.value;
		// [-3,-4] normalized should be [-3/5, -4/5]
		expect(actual[0]).to.be.closeTo(-0.6, 0.0001);
		expect(actual[1]).to.be.closeTo(-0.8, 0.0001);

		// Verify length is 1
		const length = Math.sqrt(actual[0] * actual[0] + actual[1] * actual[1]);
		expect(length).to.be.closeTo(1, 0.0001);
	});
});
