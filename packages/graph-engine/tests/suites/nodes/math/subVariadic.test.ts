import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/subtractVariadic.js';

describe('math/subVariadic', () => {
	test('subtracts two numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });
		node.inputs.inputs.setValue([1, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(-1);
	});
	test('subtracts multiple numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });
		node.inputs.inputs.setValue([1, 2, 5, 10]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(-16);
	});
});
