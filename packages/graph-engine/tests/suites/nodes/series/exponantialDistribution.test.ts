import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/exponentialDistribution.js';

describe('math/exponentialDistribution', () => {
	test('distributes value with default parameters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		await node.execute();

		const values = node.outputs.values.value;
		expect(values).to.have.lengthOf(5);
		expect(Math.round(values.reduce((sum, v) => sum + v, 0))).to.equal(100);
		expect(values[0]).to.be.greaterThan(values[1]);
	});

	test('respects custom length parameter', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.length.setValue(3);
		await node.execute();

		expect(node.outputs.values.value).to.have.lengthOf(3);
	});

	test('higher decay creates steeper distribution', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.decay.setValue(1.0);
		await node.execute();

		const values = node.outputs.values.value;
		const ratio = values[0] / values[1];
		expect(ratio).to.be.greaterThan(2);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.precision.setValue(3);
		await node.execute();

		const values = node.outputs.values.value;
		values.forEach(value => {
			expect(value.toString()).to.match(/^\d*\.?\d{0,3}$/);
		});
	});

	test('sum of distributed values equals input value', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue(200);
		await node.execute();

		const sum = node.outputs.values.value.reduce((acc, val) => acc + val, 0);
		expect(Math.round(sum)).to.equal(200);
	});
});
