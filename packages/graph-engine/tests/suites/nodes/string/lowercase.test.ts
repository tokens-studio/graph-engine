import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/string/lowercase.js';

describe('string/lowercase', () => {
	test('lowercases all characters', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue('HHH');

		await node.execute();

		expect(node.outputs.value.value).to.equal('hhh');
	});
});
