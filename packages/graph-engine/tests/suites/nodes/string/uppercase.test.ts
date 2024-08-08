import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/string/uppercase.js';

describe('string/uppercase', () => {
	test('uppercases all characters', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue('jjj');
		await node.execute();
		expect(node.outputs.value.value).to.equal('JJJ');
	});
});
