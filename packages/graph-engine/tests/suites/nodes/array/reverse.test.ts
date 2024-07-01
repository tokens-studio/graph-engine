import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/array/reverse.js';

describe('array/reverse', () => {
	it('does a non mutative reverse', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const array = [1, 2, 3];

		node.inputs.array.setValue(array);

		await node.execute();

		expect(node.outputs.value.value).to.eql([3, 2, 1]);
		//don't mutate the original array
		expect(array).to.eql([1, 2, 3]);
	});
});
