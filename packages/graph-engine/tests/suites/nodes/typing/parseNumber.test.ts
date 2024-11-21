import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/typing/parseNumber.js';

describe('typing/parseNumber', () => {
	test('converts integer string to number', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('42');
		node.execute();

		expect(node.outputs.value.value).toBe(42);
	});

	test('converts decimal string to number', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('3.14');
		node.execute();

		expect(node.outputs.value.value).toBe(3.14);
	});

	test('converts negative string to number', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('-123');
		node.execute();

		expect(node.outputs.value.value).toBe(-123);
	});

	test('throws error for invalid number string', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('not a number');

		expect(() => node.execute()).toThrow('Could not parse string to number');
	});
});
