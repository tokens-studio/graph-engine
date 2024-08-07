import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/slice.js';

describe('array/slice', () => {
	test('performs an array slice', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const array = [0, 1, 2, 3, 4];

		node.inputs.array.setValue(array);
		node.inputs.start.setValue(1);
		node.inputs.end.setValue(4);

		await node.execute();

		expect(node.outputs.value.value).to.eql([1, 2, 3]);
		//don't mutate the original array
		expect(array).to.eql([0, 1, 2, 3, 4]);
	});
});
