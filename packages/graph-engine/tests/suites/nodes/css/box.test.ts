import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/css/box.js';

describe('css/box', () => {
	test('produces the css box descriptionbs', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.top.setValue(5);
		node.inputs.right.setValue(6);
		node.inputs.bottom.setValue(3);
		node.inputs.left.setValue(4);

		await node.execute();

		expect(node.outputs.value.value).to.equal('5 6 3 4');
	});
});
