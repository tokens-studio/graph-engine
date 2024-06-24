import { Graph } from '../../../../src/graph/graph.js';
import Node from '../../../../src/nodes/math/multiplyVariadic';

describe('math/mul', () => {
	it('multiplies two numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 2]);
		await node.execute();
		expect(node.outputs.value.value).toStrictEqual(2);
	});
	it('multiplies multiple numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([8, 2, 2]);
		await node.execute();
		expect(node.outputs.value.value).toStrictEqual(32);
	});
});
