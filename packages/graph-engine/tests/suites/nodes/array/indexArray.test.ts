import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/indexArray.js';

describe('array/indexArray', () => {
	test('returns the expected value', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.array.setValue([0, 1, 2]);
		node.inputs.index.setValue(1);

		await node.execute();

		const output = node.outputs.value.value;
		expect(output).to.eql(1);
	});

	test('returns value at negative index', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.array.setValue([11, 22, 33, 44, 55]);
		node.inputs.index.setValue(-2);

		await node.execute();

		const output = node.outputs.value.value;
		expect(output).to.eql(44);
	});

	test('returns undefined when out of bounds', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.array.setValue([0, 1, 2]);
		node.inputs.index.setValue(-5);

		await node.execute();

		const output = node.outputs.value.value;
		expect(output).to.be.undefined;
	});
});
