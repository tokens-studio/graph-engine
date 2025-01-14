import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/shuffle.js';

describe('array/shuffle', () => {
	test('shuffles array elements', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		node.inputs.array.setValue(input);

		await node.execute();

		const actual = node.outputs.value.value;

		// Length should be the same
		expect(actual).to.have.length(input.length);
		// All elements should still be present
		expect(actual.sort()).to.eql(input.sort());
		// Array should be shuffled (this could theoretically fail but is extremely unlikely)
		expect(actual).to.not.eql(input);
		// Original array should not be modified
		expect(input).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});

	test('handles array with objects', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const obj1 = { id: 1 };
		const obj2 = { id: 2 };
		const obj3 = { id: 3 };
		const input = [obj1, obj2, obj3];

		node.inputs.array.setValue(input);

		await node.execute();

		const actual = node.outputs.value.value as typeof input;

		// Length should be the same
		expect(actual).to.have.length(input.length);
		// Should contain all original objects
		expect(actual).to.include(obj1);
		expect(actual).to.include(obj2);
		expect(actual).to.include(obj3);
		// References should be preserved
		expect(actual.find(o => o.id === 1)).to.equal(obj1);
	});

	test('handles empty array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([]);

		await node.execute();

		expect(node.outputs.value.value).to.eql([]);
	});

	test('handles single element array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([1]);

		await node.execute();

		expect(node.outputs.value.value).to.eql([1]);
	});
});
