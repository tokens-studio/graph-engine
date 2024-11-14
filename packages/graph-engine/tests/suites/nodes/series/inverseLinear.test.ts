import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/series/inverseLinear.js';

describe('series/inverseLinear', () => {
	test('maps value in range correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue(0.5);
		node.inputs.inMin.setValue(0);
		node.inputs.inMax.setValue(1);
		node.inputs.outMin.setValue(0);
		node.inputs.outMax.setValue(100);

		await node.execute();

		expect(node.outputs.value.value).toBe(50);
	});

	test('handles inverse ranges', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue(0.75);
		node.inputs.inMin.setValue(0);
		node.inputs.inMax.setValue(1);
		node.inputs.outMin.setValue(100);
		node.inputs.outMax.setValue(0);

		await node.execute();

		expect(node.outputs.value.value).toBe(25);
	});

	test('clamps values when enabled', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue(2);
		node.inputs.inMin.setValue(0);
		node.inputs.inMax.setValue(1);
		node.inputs.outMin.setValue(0);
		node.inputs.outMax.setValue(100);
		node.inputs.clamp.setValue(true);

		await node.execute();

		expect(node.outputs.value.value).toBe(100);
	});

	test('allows out of range values when clamping disabled', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue(2);
		node.inputs.inMin.setValue(0);
		node.inputs.inMax.setValue(1);
		node.inputs.outMin.setValue(0);
		node.inputs.outMax.setValue(100);
		node.inputs.clamp.setValue(false);

		await node.execute();

		expect(node.outputs.value.value).toBe(200);
	});

	test('handles equal input range', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue(5);
		node.inputs.inMin.setValue(1);
		node.inputs.inMax.setValue(1);
		node.inputs.outMin.setValue(0);
		node.inputs.outMax.setValue(100);

		await node.execute();

		expect(node.outputs.value.value).toBe(0);
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue(0.333);
		node.inputs.inMin.setValue(0);
		node.inputs.inMax.setValue(1);
		node.inputs.outMin.setValue(0);
		node.inputs.outMax.setValue(100);
		node.inputs.precision.setValue(3);

		await node.execute();

		expect(node.outputs.value.value).toBe(33.3);
	});
});
