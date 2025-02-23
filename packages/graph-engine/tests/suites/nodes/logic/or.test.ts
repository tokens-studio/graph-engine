import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/logic/or.js';

describe('logic/or', () => {
	test('returns true when any input is true', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([false, true, false]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(true);
	});

	test('returns false when all inputs are false', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([false, false, false]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(false);
	});

	test('returns true when all inputs are true', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([true, true, true]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(true);
	});

	test('returns false when inputs array is empty', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(false);
	});
});
