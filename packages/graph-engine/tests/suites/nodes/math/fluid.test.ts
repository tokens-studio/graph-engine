import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/math/fluid.js';

describe('math/fluid', () => {
	test('calculates fluid value correctly with normal order', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(16);
		node.inputs.maxSize.setValue(32);
		node.inputs.minViewport.setValue(200);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.viewport.setValue(700);
		node.inputs.precision.setValue(2);

		node.execute();

		expect(node.outputs.value.value).toBe(24);
	});

	test('handles reversed min/max size values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(32);
		node.inputs.maxSize.setValue(16);
		node.inputs.minViewport.setValue(200);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.viewport.setValue(700);
		node.inputs.precision.setValue(2);

		node.execute();

		expect(node.outputs.value.value).toBe(24);
	});

	test('respects different precision values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(16);
		node.inputs.maxSize.setValue(32);
		node.inputs.minViewport.setValue(320);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.viewport.setValue(768);
		node.inputs.precision.setValue(0);

		node.execute();

		expect(node.outputs.value.value).toBe(24);
	});

	test('handles equal viewport values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(16);
		node.inputs.maxSize.setValue(32);
		node.inputs.minViewport.setValue(800);
		node.inputs.maxViewport.setValue(800);
		node.inputs.viewport.setValue(800);
		node.inputs.precision.setValue(2);

		node.execute();

		expect(node.outputs.value.value).toBe(16);
	});
});
