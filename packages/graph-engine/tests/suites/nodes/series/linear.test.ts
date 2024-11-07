import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/linear.js';

describe('series/linear', () => {
	test('creates evenly spaced numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.start.setValue(0);
		node.inputs.stop.setValue(1);
		node.inputs.count.setValue(5);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0, 0.25, 0.5, 0.75, 1]);
	});

	test('handles negative ranges', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.start.setValue(-1);
		node.inputs.stop.setValue(1);
		node.inputs.count.setValue(3);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([-1, 0, 1]);
	});

	test('handles single point', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.start.setValue(0);
		node.inputs.stop.setValue(1);
		node.inputs.count.setValue(1);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0]);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.start.setValue(0);
		node.inputs.stop.setValue(1);
		node.inputs.count.setValue(3);
		node.inputs.precision.setValue(3);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0, 0.5, 1]);
	});
});
