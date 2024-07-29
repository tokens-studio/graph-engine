import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/concat.js';

describe('array/concat', () => {
	test('concats the expected nodes', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a = [1, 2, 3];
		const b = [4, 5, 6];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.eql([1, 2, 3, 4, 5, 6]);
		expect(a).to.eql([1, 2, 3]);
		expect(b).to.eql([4, 5, 6]);
	});
});
