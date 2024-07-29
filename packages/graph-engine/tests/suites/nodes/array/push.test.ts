import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/push.js';

describe('array/push', () => {
	test('does a non mutative push', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const array = [1, 2, 3];

		node.inputs.array.setValue(array);
		node.inputs.item.setValue(4);

		await node.execute();

		expect(node.outputs.value.value).to.eql([1, 2, 3, 4]);
		//don't mutate the original array
		expect(array).to.eql([1, 2, 3]);
	});
});
