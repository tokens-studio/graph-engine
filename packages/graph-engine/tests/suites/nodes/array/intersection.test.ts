import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/intersection.js';

describe('array/intersection', () => {
	test('finds common elements between arrays', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const a = [1, 2, 3, 4];
		const b = [3, 4, 5, 6];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.eql([3, 4]);
		// Ensure original arrays weren't modified
		expect(a).to.eql([1, 2, 3, 4]);
		expect(b).to.eql([3, 4, 5, 6]);
	});

	test('handles arrays with objects', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const obj1 = { id: 1 };
		const obj2 = { id: 2 };
		const obj3 = { id: 3 };

		const a = [obj1, obj2, obj3];
		const b = [obj2, obj3];

		node.inputs.a.setValue(a);
		node.inputs.b.setValue(b);

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.have.length(2);
		expect(actual).to.include(obj2);
		expect(actual).to.include(obj3);
	});

	test('handles empty arrays', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.a.setValue([1, 2, 3]);
		node.inputs.b.setValue([]);

		await node.execute();

		expect(node.outputs.value.value).to.eql([]);
	});

	test('throws error when array types do not match', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.a.setValue([1, 2, 3]);
		node.inputs.b.setValue(['a', 'b', 'c']);

		await expect(node.execute()).rejects.toThrow('Array types must match');
	});
});
