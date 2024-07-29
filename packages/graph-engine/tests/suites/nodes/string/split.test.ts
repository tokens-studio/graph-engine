import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/string/split.js';

describe('string/split', () => {
	test('splits a string as expected', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('HHH');
		node.inputs.value.setValue('H,H,H');
		await node.execute();
		expect(node.outputs.value.value).to.eql(['H', 'H', 'H']);
	});
});
