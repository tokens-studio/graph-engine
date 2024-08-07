import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/multiplyVariadic.js';

describe('math/mul', () => {
	test('multiplies two numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(2);
	});
	test('multiplies multiple numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([8, 2, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(32);
	});
});
