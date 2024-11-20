import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/naming/greekLetter.js';

describe('node/greekLetter', () => {
	test('generates basic Greek letters correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test first few letters
		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('alpha');

		node.inputs.index.setValue(1);
		await node.execute();
		expect(node.outputs.value.value).toBe('beta');

		node.inputs.index.setValue(2);
		await node.execute();
		expect(node.outputs.value.value).toBe('gamma');
	});

	test('generates all Greek letters correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const expectedLetters = [
			'alpha',
			'beta',
			'gamma',
			'delta',
			'epsilon',
			'zeta',
			'eta',
			'theta',
			'iota',
			'kappa',
			'lambda',
			'mu',
			'nu',
			'xi',
			'omicron',
			'pi',
			'rho',
			'sigma',
			'tau',
			'upsilon',
			'phi',
			'chi',
			'psi',
			'omega'
		];

		for (let i = 0; i < expectedLetters.length; i++) {
			node.inputs.index.setValue(i);
			await node.execute();
			expect(node.outputs.value.value).toBe(expectedLetters[i]);
		}
	});

	test('handles index clamping correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Test negative index (should clamp to alpha)
		node.inputs.index.setValue(-1);
		await node.execute();
		expect(node.outputs.value.value).toBe('alpha');

		// Test index beyond range (should clamp to omega)
		node.inputs.index.setValue(30);
		await node.execute();
		expect(node.outputs.value.value).toBe('omega');
	});

	test('handles prefix and suffix correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.prefix.setValue('greek-');
		node.inputs.suffix.setValue('-letter');

		node.inputs.index.setValue(0);
		await node.execute();
		expect(node.outputs.value.value).toBe('greek-alpha-letter');

		node.inputs.index.setValue(23);
		await node.execute();
		expect(node.outputs.value.value).toBe('greek-omega-letter');
	});
});
