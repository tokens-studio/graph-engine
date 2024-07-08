import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/math/addVariadic.js';

describe('math/addVariadic', () => {
	test('adds two numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 2]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(3);
	});
	test('adds multiple numbers', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([1, 2, 5, 10]);
		await node.execute();
		expect(node.outputs.value.value).to.equal(18);
	});
});
