import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/naming/hierarchyLevel.js';

describe('node/hierarchyLevel', () => {
	test('generates basic hierarchy levels correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test primary (index 0)
		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('primary');

		// Test secondary (index 1)
		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('secondary');

		// Test tertiary (index 2)
		node.inputs.index.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).toBe('tertiary');
	});

	test('generates all levels up to denary correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const expectedLevels = [
			'primary',
			'secondary',
			'tertiary',
			'quaternary',
			'quinary',
			'senary',
			'septenary',
			'octonary',
			'nonary',
			'denary'
		];

		for (let i = 0; i < expectedLevels.length; i++) {
			node.inputs.index.setValue(i);
			await node.execute();
			expect(node.outputs.value.value).toBe(expectedLevels[i]);
		}
	});

	test('handles index clamping correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test negative index (should clamp to primary)
		node.inputs.index.setValue(-1);
		await node.execute();
		expect(node.outputs.value.value).toBe('primary');

		// Test index beyond range (should clamp to denary)
		node.inputs.index.setValue(20);
		await node.execute();
		expect(node.outputs.value.value).toBe('denary');
	});

	test('handles prefix and suffix correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.prefix.setValue('level-');
		node.inputs.suffix.setValue('-importance');

		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('level-primary-importance');

		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('level-secondary-importance');
	});
});
