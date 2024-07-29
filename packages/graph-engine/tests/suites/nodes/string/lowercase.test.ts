import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/string/lowercase.js';

describe('string/lowercase', () => {
	test('lowercases all characters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('HHH');

		await node.execute();

		expect(node.outputs.value.value).to.equal('hhh');
	});
});
