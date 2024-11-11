import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/fibonacci.js';

describe('series/fibonacci', () => {
	test('generates classic fibonacci sequence', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.length.setValue(8);
		node.inputs.startFirst.setValue(0);
		node.inputs.startSecond.setValue(1);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0, 1, 1, 2, 3, 5, 8, 13]);
	});

	test('handles custom starting values', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.length.setValue(5);
		node.inputs.startFirst.setValue(2);
		node.inputs.startSecond.setValue(3);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([2, 3, 5, 8, 13]);
	});

	test('handles single term', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.length.setValue(1);
		node.inputs.startFirst.setValue(0);
		node.inputs.startSecond.setValue(1);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0]);
	});

	test('handles zero length', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.length.setValue(0);
		await node.execute();

		expect(node.outputs.array.value).to.eql([]);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.length.setValue(4);
		node.inputs.startFirst.setValue(0.5);
		node.inputs.startSecond.setValue(1.5);
		node.inputs.precision.setValue(1);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0.5, 1.5, 2.0, 3.5]);
	});
});
