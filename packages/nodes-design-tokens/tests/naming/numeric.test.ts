import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/naming/numeric.js';

describe('node/numeric', () => {
	test('generates basic numeric scale correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test index 0 (should output 1)
		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('1');

		// Test index 1 (should output 2)
		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('2');

		// Test index 4 (should output 5)
		node.inputs.index.setValue(4);
		await node.execute();
		expect(node.outputs.value.value).toBe('5');
	});

	test('applies multiplier correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.multiplier.setValue(100);

		// Test index 0 (should output 100)
		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('100');

		// Test index 1 (should output 200)
		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('200');

		// Test with decimal multiplier
		node.inputs.multiplier.setValue(0.5);
		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('1');
	});

	test('handles prefix and suffix correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.prefix.setValue('scale-');
		node.inputs.suffix.setValue('%');
		node.inputs.multiplier.setValue(100);

		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('scale-100%');

		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('scale-200%');

		// Test with different prefix/suffix
		node.inputs.prefix.setValue('level');
		node.inputs.suffix.setValue('px');
		node.inputs.multiplier.setValue(8);

		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('level8px');
	});

	test('handles negative indices correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.index.setValue(-1);
		await node.execute();
		expect(node.outputs.value.value).toBe('0');

		node.inputs.multiplier.setValue(100);
		await node.execute();
		expect(node.outputs.value.value).toBe('0');
	});
});
