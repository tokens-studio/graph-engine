import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/string/join.js';

describe('string/join', () => {
	test('should join the string array correctly', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.array.setValue(['a', 'b', 'c']);
		node.inputs.delimiter.setValue(',');

		await node.execute();

		expect(node.outputs.value.value).to.equal('a,b,c');
	});
});
