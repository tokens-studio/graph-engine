import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/vector2/scale.js';

describe('vector2/scale', () => {
	test('scales vector by positive scalar', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [1, 2];
		const scalar = 2;

		node.inputs.vector.setValue(vector);
		node.inputs.scalar.setValue(scalar);

		await node.execute();

		const actual = node.outputs.value.value;
		expect(actual).to.eql([2, 4]);
		// Ensure original vector wasn't modified
		expect(vector).to.eql([1, 2]);
	});

	test('scales vector by negative scalar', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [1, 2];
		const scalar = -2;

		node.inputs.vector.setValue(vector);
		node.inputs.scalar.setValue(scalar);

		await node.execute();

		expect(node.outputs.value.value).to.eql([-2, -4]);
	});

	test('scales by zero', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [1, 2];
		const scalar = 0;

		node.inputs.vector.setValue(vector);
		node.inputs.scalar.setValue(scalar);

		await node.execute();

		expect(node.outputs.value.value).to.eql([0, 0]);
	});

	test('uses default scalar of 1', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const vector: [number, number] = [1, 2];
		node.inputs.vector.setValue(vector);

		await node.execute();

		expect(node.outputs.value.value).to.eql([1, 2]);
	});
});
