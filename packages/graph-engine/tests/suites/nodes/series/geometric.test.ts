import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/series/geometric.js';

describe('series/geometric', () => {
	test('generates the expected series', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.base.setValue(16);
		node.inputs.stepsDown.setValue(1);
		node.inputs.stepsUp.setValue(1);
		node.inputs.ratio.setValue(1.2);
		node.inputs.precision.setValue(0);

		await node.execute();

		const output = node.outputs.array.value;

		expect(output).to.eql([13, 16, 19]);
	});
});
