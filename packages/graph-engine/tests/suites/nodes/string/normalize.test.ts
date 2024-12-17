import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node, {
	NormalizationForm
} from '../../../../src/nodes/string/normalize.js';

describe('string/normalize', () => {
	test('should remove accents when removeAccents is true', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('café résumé');
		node.inputs.removeAccents.setValue(true);
		node.inputs.form.setValue(NormalizationForm.NFC);

		await node.execute();

		expect(node.outputs.string.value).toBe('cafe resume');
	});

	test('should preserve accents when removeAccents is false', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('café résumé');
		node.inputs.removeAccents.setValue(false);
		node.inputs.form.setValue(NormalizationForm.NFC);

		await node.execute();

		expect(node.outputs.string.value).toBe('café résumé');
	});

	test('should handle different normalization forms', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		// Using a string with a precomposed character (é) vs decomposed (e + ´)
		const precomposed = 'café'; // é is a single character
		const decomposed = 'cafe\u0301'; // e and ´ are separate characters

		node.inputs.string.setValue(decomposed);
		node.inputs.removeAccents.setValue(false);

		// Test NFC (precomposed)
		node.inputs.form.setValue(NormalizationForm.NFC);
		await node.execute();
		expect(node.outputs.string.value).toBe(precomposed);

		// Test NFD (decomposed)
		node.inputs.form.setValue(NormalizationForm.NFD);
		await node.execute();
		expect(node.outputs.string.value).toBe(decomposed);
	});

	test('should handle empty string', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('');
		node.inputs.removeAccents.setValue(true);
		node.inputs.form.setValue(NormalizationForm.NFC);

		await node.execute();

		expect(node.outputs.string.value).toBe('');
	});
});
