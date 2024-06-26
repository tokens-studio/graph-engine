import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/math/divideVariadic.js';

describe('math/div', () => {
	it('divides two numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(0.5);
	});
	it('divides multiple numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([8, 2, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(2);
	});

	it('returns infinity when dividing by zero', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 0]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(Infinity);
	});
});
