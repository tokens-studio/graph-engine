import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/exponentialDecay.js';

describe('series/exponentialDecay', () => {
	test('generates sequence with default parameters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		await node.execute();

		const values = node.outputs.values.value;
		expect(values).to.have.lengthOf(5);
		expect(values[0]).to.equal(100); // Initial value
		expect(values[1]).to.be.lessThan(values[0]); // Decay occurs
	});

	test('respects custom length parameter', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.length.setValue(3);
		await node.execute();

		const values = node.outputs.values.value;
		expect(values).to.have.lengthOf(3);
	});

	test('follows exponential decay formula', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.initialValue.setValue(100);
		node.inputs.decayRate.setValue(0.5);
		node.inputs.length.setValue(3);

		await node.execute();

		const values = node.outputs.values.value;
		expect(values[0]).to.equal(100); // P
		expect(values[1]).to.be.approximately(100 * Math.exp(-0.5), 0.01); // P*e^(-k*1)
		expect(values[2]).to.be.approximately(100 * Math.exp(-1), 0.01); // P*e^(-k*2)
	});

	test('higher decay rate increases decay speed', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.decayRate.setValue(1.0);
		await node.execute();

		const values = node.outputs.values.value;
		const ratio = values[0] / values[1];
		expect(ratio).to.be.approximately(Math.E, 0.01); // e^1 for k=1
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
});
