import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/string/replace.js';

describe('string/replace', () => {
	test('should replace all occurrences of a string', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello hello world');
		node.inputs.search.setValue('hello');
		node.inputs.replace.setValue('hi');

		await node.execute();

		expect(node.outputs.string.value).toBe('hi hi world');
	});

	test('should handle empty replacement string', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello world');
		node.inputs.search.setValue('hello ');
		node.inputs.replace.setValue('');

		await node.execute();

		expect(node.outputs.string.value).toBe('world');
	});

	test('should handle search string not found', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello world');
		node.inputs.search.setValue('xyz');
		node.inputs.replace.setValue('abc');

		await node.execute();

		expect(node.outputs.string.value).toBe('hello world');
	});

	test('should handle empty input string', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('');
		node.inputs.search.setValue('test');
		node.inputs.replace.setValue('replace');

		await node.execute();

		expect(node.outputs.string.value).toBe('');
	});
});
