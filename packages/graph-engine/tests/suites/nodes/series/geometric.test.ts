import { Graph } from '../../../../src/graph/graph.js';
import Node from '../../../../src/nodes/series/geometric';

describe('series/geometric', () => {
	it('generates the expected series', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.base.setValue(16);
		node.inputs.stepsDown.setValue(1);
		node.inputs.stepsUp.setValue(1);
		node.inputs.ratio.setValue(1.2);
		node.inputs.precision.setValue(0);

		await node.execute();

		const output = node.outputs.array.value;

		expect(output).toStrictEqual([13, 16, 19]);
	});
});
