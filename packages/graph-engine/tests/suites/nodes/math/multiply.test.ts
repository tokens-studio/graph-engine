import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/multiply.js';

describe('math/mul', () => {
	test('multiplies two numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.a.setValue(1);
		node.inputs.b.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).to.equal(2);
	});
});
