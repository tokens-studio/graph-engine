import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/pow.js';

describe('math/pow', () => {
	test('powers two numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });
		node.inputs.base.setValue(2);
		node.inputs.exponent.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).to.equal(4);
	});
});
