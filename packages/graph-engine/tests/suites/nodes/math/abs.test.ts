
import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/abs.js';

describe('math/abs', () => {
	test('absolutes the input', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.input.setValue(-1);
		await node.execute();
		expect(node.outputs.value.value).to.equal(1);
	});
});
