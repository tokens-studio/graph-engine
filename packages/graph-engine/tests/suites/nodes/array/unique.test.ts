import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/unique.js';

describe('array/unique', () => {
	test('removes duplicates from array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const input = [1, 2, 2, 3, 3, 4, 4, 5];
		node.inputs.array.setValue(input);

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.eql([1, 2, 3, 4, 5]);
		// Ensure original array wasn't modified
		expect(input).to.eql([1, 2, 2, 3, 3, 4, 4, 5]);
	});

	test('handles array with objects', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const obj1 = { id: 1 };
		const obj2 = { id: 2 };
		const input = [obj1, obj2, obj1, obj2];
		node.inputs.array.setValue(input);

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.have.length(2);
		expect(actual[0]).to.equal(obj1);
		expect(actual[1]).to.equal(obj2);
	});

	test('handles empty array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([]);

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.eql([]);
	});
});
