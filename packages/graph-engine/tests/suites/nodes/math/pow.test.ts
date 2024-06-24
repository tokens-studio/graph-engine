import { Graph } from '../../../../src/graph/graph.js';
import Node from '../../../../src/nodes/math/pow';

describe('math/pow', () => {
	it('powers two numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.base.setValue(2);
		node.inputs.exponent.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).toStrictEqual(4);
	});
});
