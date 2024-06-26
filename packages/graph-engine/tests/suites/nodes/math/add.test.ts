import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/math/add.js';

describe('math/add', () => {
	it('adds two numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.a.setValue(2);
		node.inputs.b.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).to.equal(3);
	});
});
