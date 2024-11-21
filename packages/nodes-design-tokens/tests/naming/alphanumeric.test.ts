import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/naming/alphanumeric.js';

describe('node/alphanumeric', () => {
	test('generates basic alphanumeric combinations correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test first few combinations (default is lowercase)
		node.inputs.letterIndex.setValue(0);
		node.inputs.numberIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('a1');

		node.inputs.letterIndex.setValue(1);
		node.inputs.numberIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('b1');

		node.inputs.letterIndex.setValue(0);
		node.inputs.numberIndex.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('a2');
	});

	test('handles uppercase correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.uppercase.setValue(true);

		node.inputs.letterIndex.setValue(0);
		node.inputs.numberIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('A1');

		// Test switching back to lowercase
		node.inputs.uppercase.setValue(false);
		await node.execute();
		expect(node.outputs.value.value).toBe('a1');
	});

	test('generates combinations across the alphabet correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.uppercase.setValue(true);

		// Test last letter combinations
		node.inputs.letterIndex.setValue(25); // Z
		node.inputs.numberIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('Z1');

		node.inputs.letterIndex.setValue(25);
		node.inputs.numberIndex.setValue(4);
		await node.execute();
		expect(node.outputs.value.value).toBe('Z5');
	});

	test('handles index clamping correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test negative indices
		node.inputs.letterIndex.setValue(-1);
		node.inputs.numberIndex.setValue(-1);
		await node.execute();
		expect(node.outputs.value.value).toBe('a1');

		// Test beyond range
		node.inputs.letterIndex.setValue(30);
		node.inputs.numberIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('z1');

		// Test with uppercase
		node.inputs.uppercase.setValue(true);
		node.inputs.letterIndex.setValue(-1);
		node.inputs.numberIndex.setValue(-1);
		await node.execute();
		expect(node.outputs.value.value).toBe('A1');

		node.inputs.letterIndex.setValue(30);
		node.inputs.numberIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('Z1');
	});

	test('handles prefix and suffix correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.prefix.setValue('level-');
		node.inputs.suffix.setValue('-variant');

		// Test with lowercase
		node.inputs.letterIndex.setValue(0);
		node.inputs.numberIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('level-a1-variant');

		// Test with uppercase
		node.inputs.uppercase.setValue(true);
		await node.execute();
		expect(node.outputs.value.value).toBe('level-A1-variant');
	});
});
