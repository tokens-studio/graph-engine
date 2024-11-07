import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/power.js';

describe('series/power', () => {
	test('generates a basic power series', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.startPower.setValue(0);
		node.inputs.endPower.setValue(3);
		node.inputs.precision.setValue(2);

		await node.execute();

		// Should generate [2^0, 2^1, 2^2, 2^3] = [1, 2, 4, 8]
		expect(node.outputs.array.value).to.eql([1, 2, 4, 8]);
	});

	test('handles negative powers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.startPower.setValue(-2);
		node.inputs.endPower.setValue(0);
		node.inputs.precision.setValue(2);

		await node.execute();

		// Should generate [2^-2, 2^-1, 2^0] = [0.25, 0.5, 1]
		expect(node.outputs.array.value).to.eql([0.25, 0.5, 1]);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(3);
		node.inputs.startPower.setValue(0);
		node.inputs.endPower.setValue(2);
		node.inputs.precision.setValue(1);

		await node.execute();

		// Should generate [3^0, 3^1, 3^2] = [1, 3, 9]
		expect(node.outputs.array.value).to.eql([1, 3, 9]);
	});

	test('handles reversed power range', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(2);
		node.inputs.startPower.setValue(2);
		node.inputs.endPower.setValue(0);
		node.inputs.precision.setValue(2);

		await node.execute();

		// Should generate empty array when start > end
		expect(node.outputs.array.value).to.eql([]);
	});

	test('handles base of 1', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(1);
		node.inputs.startPower.setValue(-2);
		node.inputs.endPower.setValue(2);
		node.inputs.precision.setValue(2);

		await node.execute();

		// All powers of 1 should be 1
		expect(node.outputs.array.value).to.eql([1, 1, 1, 1, 1]);
	});
});
