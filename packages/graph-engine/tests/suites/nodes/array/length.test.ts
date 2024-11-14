import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/length.js';

describe('array/length', () => {
	test('return length of array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([4, 5, 6]);

		await node.execute();

		expect(node.outputs.length.value).to.equal(3);
	});
});
