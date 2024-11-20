import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/css/clamp.js';

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

		node.inputs.minSize.setValue(14);
		node.inputs.maxSize.setValue(28);
		node.inputs.minViewport.setValue(320);
		node.inputs.maxViewport.setValue(1200);
		node.inputs.baseFontSize.setValue(16);

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(0.875rem, calc(1.591vw + 0.557rem), 1.75rem)'
		);
	});

	test('handles different base font size', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(20);
		node.inputs.maxSize.setValue(40);
		node.inputs.minViewport.setValue(375);
		node.inputs.maxViewport.setValue(1440);
		node.inputs.baseFontSize.setValue(20);

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(1rem, calc(1.878vw + 0.648rem), 2rem)'
		);
	});

	test('handles decimal values correctly', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(14.5);
		node.inputs.maxSize.setValue(28.5);
		node.inputs.minViewport.setValue(360);
		node.inputs.maxViewport.setValue(1280);
		node.inputs.baseFontSize.setValue(16);

		node.execute();

		expect(node.outputs.value.value).toBe(
			'clamp(0.906rem, calc(1.522vw + 0.564rem), 1.781rem)'
		);
	});

	test('maintains precision in output values', () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.minSize.setValue(18);
		node.inputs.maxSize.setValue(36);
		node.inputs.minViewport.setValue(400);
		node.inputs.maxViewport.setValue(1600);
		node.inputs.baseFontSize.setValue(16);

		node.execute();

		// Check that values are formatted to 3 decimal places
		const output = node.outputs.value.value;
		const numbers = output.match(/[\d.]+/g);
		numbers?.forEach(num => {
			const decimals = num.split('.')[1];
			expect(decimals?.length).toBeLessThanOrEqual(3);
		});
	});
});
