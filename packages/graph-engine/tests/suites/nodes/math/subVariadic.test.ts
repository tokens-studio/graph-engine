import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/math/subtractVariadic.js';

describe('math/subVariadic', () => {
	it('subtracts two numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.inputs.setValue([1, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(-1);
	});
	it('subtracts multiple numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.inputs.setValue([1, 2, 5, 10]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(-16);
	});
});
