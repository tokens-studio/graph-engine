import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/subtract.js';

describe('math/sub', () => {
	test('subtracts two numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });
		node.inputs.a.setValue(1);
		node.inputs.b.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).to.equal(-1);
	});
});
