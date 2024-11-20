import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/css/accessibleClamp.js';

describe('css/clamp', () => {
	test('generates clamp function with default values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(1rem, calc(0.5vw + 0.9rem), 1.5rem)'
		);
	});

	test('generates clamp function with custom values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(16);
		node.inputs.maxSize.setValue(32);
		node.inputs.minViewport.setValue(320);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.baseFontSize.setValue(16);
		node.inputs.precision.setValue(3);

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(1rem, calc(1.818vw + 0.636rem), 2rem)'
		);
	});

	test('handles different precision values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(16);
		node.inputs.maxSize.setValue(32);
		node.inputs.minViewport.setValue(320);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.baseFontSize.setValue(16);
		node.inputs.precision.setValue(1);

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(1rem, calc(1.8vw + 0.6rem), 2rem)'
		);
	});

	test('handles zero precision', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(16);
		node.inputs.maxSize.setValue(32);
		node.inputs.minViewport.setValue(320);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.baseFontSize.setValue(16);
		node.inputs.precision.setValue(0);

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(1rem, calc(2vw + 1rem), 2rem)'
		);
	});

	test('handles high precision values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(16);
		node.inputs.maxSize.setValue(32);
		node.inputs.minViewport.setValue(320);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.baseFontSize.setValue(16);
		node.inputs.precision.setValue(5);

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(1rem, calc(1.81818vw + 0.63636rem), 2rem)'
		);
	});
});
