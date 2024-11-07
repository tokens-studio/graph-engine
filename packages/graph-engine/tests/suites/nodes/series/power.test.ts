import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/power.js';

describe('series/power', () => {
	test('generates a basic power series', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.powers.setValue([0, 1, 2, 3]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 2, 4, 8]);
	});

	test('handles negative powers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.powers.setValue([-2, -1, 0]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([0.25, 0.5, 1]);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(3);
		node.inputs.powers.setValue([0, 1, 2]);
		node.inputs.precision.setValue(1);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 3, 9]);
	});

	test('handles reversed power range', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.powers.setValue([2, 1, 0]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([4, 2, 1]);
	});

	test('handles base of 1', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(1);
		node.inputs.powers.setValue([-2, -1, 0, 1, 2]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 1, 1, 1, 1]);
	});

	test('handles alternating powers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.powers.setValue([1, -1, 2, -2]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([2, 0.5, 4, 0.25]);
	});

	test('handles fractional powers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.powers.setValue([0, 0.5, 1, 1.5]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 1.41, 2, 2.83]);
	});
});
