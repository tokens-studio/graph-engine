import { Graph } from '../../../../src/graph/graph.js';
import Node from '../../../../src/nodes/string/lowercase.js';

describe('string/lowercase', () => {
	it('lowercases all characters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('HHH');

		await node.execute();

		expect(node.outputs.value.value).toStrictEqual('hhh');
	});
});
