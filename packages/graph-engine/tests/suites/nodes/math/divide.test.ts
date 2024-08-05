import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/math/divideVariadic.js';

describe('math/div', () => {
	test('divides two numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(0.5);
	});
	test('divides multiple numbers', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([8, 2, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(2);
	});

	test('returns infinity when dividing by zero', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 0]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(Infinity);
	});
});
