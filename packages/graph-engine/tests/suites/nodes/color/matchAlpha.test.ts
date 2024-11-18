import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import { getAllOutputs } from '../../../../src/utils/node.js';
import { isNaN } from 'lodash-es';
import Node from '../../../../src/nodes/color/matchAlpha.js';

describe('color/matchAlpha', () => {
	test('all colors are valid and a result that makes sense can be found', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.foreground.setValue({
			space: 'srgb',
			channels: [0.96, 0, 0]
		});
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [0, 0, 0]
		});
		node.inputs.reference.setValue({
			space: 'srgb',
			channels: [0.48, 0, 0]
		});

		await node.run();

		const output = getAllOutputs(node);

		expect(output.alpha).to.equal(0.5);
	});

	test('the hues of fg and bg are too different and no result makes sense', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.foreground.setValue({
			space: 'srgb',
			channels: [0.96, 0, 0]
		});
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [0, 0.2, 0]
		});
		node.inputs.reference.setValue({
			space: 'srgb',
			channels: [0.48, 0, 0]
		});

		await node.run();

		const output = getAllOutputs(node);

		expect(isNaN(output.alpha)).toEqual(true);
	});

	test('bg and ref are the same (within precision)', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.foreground.setValue({
			space: 'srgb',
			channels: [0.96, 0.96, 0]
		});
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [0.33, 0.33, 0]
		});
		node.inputs.reference.setValue({
			space: 'srgb',
			channels: [0.325, 0.335, 0]
		});

		await node.run();

		const output = getAllOutputs(node);

		expect(output.alpha).to.equal(0);
	});

	test('ref is further from bg than fg, so the result is outside the valid alpha range (0-1)', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.foreground.setValue({
			space: 'srgb',
			channels: [0, 0.5, 0.5]
		});
		node.inputs.background.setValue({
			space: 'srgb',
			channels: [0, 0, 0]
		});
		node.inputs.reference.setValue({
			space: 'srgb',
			channels: [0, 1, 1]
		});

		await node.run();

		const output = getAllOutputs(node);

		expect(isNaN(output.alpha)).toEqual(true);
	});
});
