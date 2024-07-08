import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/math/pow.js';

describe('math/pow', () => {
	test('powers two numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.base.setValue(2);
		node.inputs.exponent.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).to.equal(4);
	});
});
