import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/alternating.js';

describe('series/alternating', () => {
	test('alternates values with default pattern', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.sequence.setValue([1, 2, 3, 4]);
		node.inputs.pattern.setValue([1, -1]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, -2, 3, -4]);
	});

	test('handles custom patterns', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.sequence.setValue([1, 2, 3, 4, 5, 6]);
		node.inputs.pattern.setValue([1, -1, -1]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, -2, -3, 1, -5, -6]);
	});

	test('handles empty pattern', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.sequence.setValue([1, 2, 3]);
		node.inputs.pattern.setValue([]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1, 2, 3]);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.sequence.setValue([1.234, 2.345]);
		node.inputs.pattern.setValue([1, -1]);
		node.inputs.precision.setValue(1);

		await node.execute();

		expect(node.outputs.array.value).to.eql([1.2, -2.3]);
	});

	test('generates correct indexed values', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.sequence.setValue([1, 2, 3]);
		node.inputs.pattern.setValue([1, -1]);
		node.inputs.precision.setValue(2);

		await node.execute();

		expect(node.outputs.indexed.value).to.eql([
			{ index: 0, value: 1 },
			{ index: 1, value: -2 },
			{ index: 2, value: 3 }
		]);
	});
});
