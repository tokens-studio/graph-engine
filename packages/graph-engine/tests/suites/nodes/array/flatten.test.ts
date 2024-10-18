import { Graph } from '../../../../src/graph/graph.js';
import { NumberSchema } from '../../../../src/index.js';
import { arrayOf } from '../../../../src/schemas/utils.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/flatten.js';

describe('array/flatten', () => {
	test('does not work without inputs', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		try {
			await node.execute();
		} catch (err) {
			expect(err.message).to.be.eql('Input array must be an array of arrays');
		}
	});

	test('flattens arrays as expected', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue(
			[
				[1, 2],
				[3, 4]
			],
			{
				type: arrayOf(arrayOf(NumberSchema))
			}
		);

		await node.execute();

		const actual = node.outputs.array.value;

		expect(actual).to.eql([1, 2, 3, 4]);
	});
});
