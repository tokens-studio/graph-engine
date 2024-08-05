
import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/add.js';

describe('math/add', () => {
	test('adds two numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.a.setValue(2);
		node.inputs.b.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).to.equal(3);
	});
});
