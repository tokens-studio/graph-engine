
import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/series/harmonic.js';

describe('series/harmonic', () => {
	test('generates the expected series', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.base.setValue(16);
		node.inputs.stepsDown.setValue(2);
		node.inputs.stepsUp.setValue(2);
		node.inputs.notes.setValue(3);
		node.inputs.ratio.setValue(1.2);
		node.inputs.precision.setValue(1);

		await node.execute();

		const output = node.outputs.array.value;

		expect(output).to.eql([14.2, 15.1, 16, 17, 18.1]);
	});
});
