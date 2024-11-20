import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/naming/tshirtSize.js';

describe('node/tshirtSize', () => {
	test('generates default schema sizes correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test base size (md)
		node.inputs.index.setValue(0);
		node.inputs.baseIndex.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('md');

		// Test one step up (lg)
		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('lg');

		// Test one step down (sm)
		node.inputs.index.setValue(-1);
		await node.execute();
		expect(node.outputs.value.value).toBe('sm');

		// Test xl
		node.inputs.index.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).toBe('xl');

		// Test xs
		node.inputs.index.setValue(-2);
		await node.execute();
		expect(node.outputs.value.value).toBe('xs');

		// Test 2xl
		node.inputs.index.setValue(3);
		await node.execute();
		expect(node.outputs.value.value).toBe('2xl');

		// Test 2xs
		node.inputs.index.setValue(-3);
		await node.execute();
		expect(node.outputs.value.value).toBe('2xs');
	});

	test('generates short schema sizes correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.schema.setValue('short');

		// Test base size (m)
		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('m');

		// Test xl and xs
		node.inputs.index.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).toBe('xl');

		node.inputs.index.setValue(-2);
		await node.execute();
		expect(node.outputs.value.value).toBe('xs');
	});

	test('generates long schema sizes correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.schema.setValue('long');

		// Test base size (medium)
		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('medium');

		// Test x-large and x-small
		node.inputs.index.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).toBe('x-large');

		node.inputs.index.setValue(-2);
		await node.execute();
		expect(node.outputs.value.value).toBe('x-small');

		// Test 2x large and 2x small
		node.inputs.index.setValue(3);
		await node.execute();
		expect(node.outputs.value.value).toBe('2x-large');

		node.inputs.index.setValue(-3);
		await node.execute();
		expect(node.outputs.value.value).toBe('2x-small');
	});

	test('handles prefix and suffix correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.prefix.setValue('size-');
		node.inputs.suffix.setValue('-token');
		node.inputs.index.setValue(0);

		await node.execute();
		expect(node.outputs.value.value).toBe('size-md-token');
	});

	test('handles different base indices correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.baseIndex.setValue(2);

		// Now index 2 should be md
		node.inputs.index.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).toBe('md');

		// Index 3 should be lg
		node.inputs.index.setValue(3);
		await node.execute();
		expect(node.outputs.value.value).toBe('lg');

		// Index 1 should be sm
		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('sm');
	});
});
