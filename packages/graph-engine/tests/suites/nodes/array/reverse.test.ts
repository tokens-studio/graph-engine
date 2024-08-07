import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/array/reverse.js';

describe('array/reverse', () => {
	test('does a non mutative reverse', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		const array = [1, 2, 3];

		node.inputs.array.setValue(array);

		await node.execute();

		expect(node.outputs.value.value).to.eql([3, 2, 1]);
		//don't mutate the original array
		expect(array).to.eql([1, 2, 3]);
	});
});
