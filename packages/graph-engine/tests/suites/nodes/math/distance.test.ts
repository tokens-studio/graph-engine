import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/math/distance.js';

describe('math/distance', () => {
	test('calculates absolute distance between positive numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.a.setValue(5);
		node.inputs.b.setValue(2);

		await node.execute();

		expect(node.outputs.distance.value).to.equal(3);
	});

	test('calculates absolute distance between negative numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.a.setValue(-2);
		node.inputs.b.setValue(-5);

		await node.execute();

		expect(node.outputs.distance.value).to.equal(3);
	});

	test('calculates absolute distance with mixed signs', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.a.setValue(2);
		node.inputs.b.setValue(-3);

		await node.execute();

		expect(node.outputs.distance.value).to.equal(5);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.a.setValue(1.23456);
		node.inputs.b.setValue(4.56789);
		node.inputs.precision.setValue(3);

		await node.execute();

		expect(node.outputs.distance.value).to.equal(3.333);
	});
});
