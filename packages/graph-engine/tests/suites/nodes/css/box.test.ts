import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/css/box.js';

describe('css/box', () => {
	it('produces the css box descriptionbs', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.top.setValue(5);
		node.inputs.right.setValue(6);
		node.inputs.bottom.setValue(3);
		node.inputs.left.setValue(4);

		await node.execute();

		expect(node.outputs.value.value).to.equal('5 6 3 4');
	});
});
