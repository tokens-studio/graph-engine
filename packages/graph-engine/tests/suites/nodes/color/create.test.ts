import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/color/create.js';

describe('color/create', () => {
	test('creates the expected color with rgba', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.space.setValue('srgb');
		node.inputs.a.setValue(1);
		node.inputs.b.setValue(1);
		node.inputs.c.setValue(1);
		node.inputs.alpha.setValue(0.5);

		await node.execute();
		const output = node.outputs.value.value;
		expect(output).to.deep.equal({
			alpha: 0.5,
			channels: [1, 1, 1],
			space: 'srgb'
		});
	});

	test('creates the expected color with hsl', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.space.setValue('hsl');
		node.inputs.a.setValue(0);
		node.inputs.b.setValue(1);
		node.inputs.c.setValue(0.5);

		await node.execute();
		const output = node.outputs.value.value;

		expect(output).to.deep.equal({
			alpha: undefined,
			channels: [0, 1, 0.5],
			space: 'hsl'
		});
	});

	test('creates the expected color with hsv', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.space.setValue('hsv');
		node.inputs.a.setValue(88);
		node.inputs.b.setValue(100);
		node.inputs.c.setValue(0.9);
		node.inputs.alpha.setValue(0.5);

		await node.execute();
		const output = node.outputs.value.value;

		expect(output).to.deep.equal({
			alpha: 0.5,
			channels: [88, 100, 0.9],
			space: 'hsv'
		});
	});
});
