import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/string/uppercase.js';

describe('string/uppercase', () => {
	it('uppercases all characters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('jjj');
		await node.execute();
		expect(node.outputs.value.value).to.equal('JJJ');
	});
});
