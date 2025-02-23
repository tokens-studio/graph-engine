import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/logic/and.js';

describe('logic/and', () => {
	test('returns true when all inputs are true', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([true, true, true]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(true);
	});

	test('returns false when any input is false', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([true, false, true]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(false);
	});

	test('returns false when all inputs are false', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([false, false, false]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(false);
	});

	test('returns true when inputs array is empty', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue([]);

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe(true);
	});
});
