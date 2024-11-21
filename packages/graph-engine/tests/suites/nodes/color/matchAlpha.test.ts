import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import { getAllOutputs } from '../../../../src/utils/node.js';
import Color from 'colorjs.io';
import Node from '../../../../src/nodes/color/matchAlpha.js';

type number3 = [number, number, number];

describe('color/matchAlpha', () => {
	test('all colors are valid and a result that makes sense can be found', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const fg: number3 = [0.96, 0, 0];
		const bg: number3 = [0, 0, 0];
		const ref: number3 = [0.48, 0, 0];

		node.inputs.foreground.setValue({ space: 'srgb', channels: fg });
		node.inputs.background.setValue({ space: 'srgb', channels: bg });
		node.inputs.reference.setValue({ space: 'srgb', channels: ref });

		await node.run();

		const output = getAllOutputs(node);

		const expAlpha = 0.5;
		const expColor = { space: 'srgb', channels: fg, alpha: expAlpha };

		expect(output.inRange).to.equal(true);
		expect(output.color as Color).to.deep.equal(expColor);
		expect(output.alpha).to.equal(expAlpha);
	});

	test('the hues of fg and bg are too different and no result makes sense', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const fg: number3 = [0.96, 0, 0];
		const bg: number3 = [0, 0.2, 0];
		const ref: number3 = [0.48, 0, 0];

		node.inputs.foreground.setValue({ space: 'srgb', channels: fg });
		node.inputs.background.setValue({ space: 'srgb', channels: bg });
		node.inputs.reference.setValue({ space: 'srgb', channels: ref });

		await node.run();

		const output = getAllOutputs(node);

		const expColor = { space: 'srgb', channels: fg, alpha: 1 };

		expect(output.inRange).to.equal(false);
		expect(output.color as Color).to.deep.equal(expColor);
		expect(Number.isNaN(output.alpha)).toEqual(true);
	});

	test('bg and ref are the same (within threshold)', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const fg: number3 = [0.96, 0.96, 0];
		const bg: number3 = [0.33, 0.33, 0];
		const ref: number3 = [0.325, 0.335, 0];

		node.inputs.foreground.setValue({ space: 'srgb', channels: fg });
		node.inputs.background.setValue({ space: 'srgb', channels: bg });
		node.inputs.reference.setValue({ space: 'srgb', channels: ref });

		await node.run();

		const output = getAllOutputs(node);

		const expAlpha = 0;
		const expColor = { space: 'srgb', channels: fg, alpha: expAlpha };

		expect(output.inRange).to.equal(true);
		expect(output.color as Color).to.deep.equal(expColor);
		expect(output.alpha).to.equal(expAlpha);
	});

	test('ref is further from bg than fg, so the result is outside the valid alpha range (0-1)', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const fg: number3 = [0, 0.5, 0.5];
		const bg: number3 = [0, 0, 0];
		const ref: number3 = [0, 1, 1];

		node.inputs.foreground.setValue({ space: 'srgb', channels: fg });
		node.inputs.background.setValue({ space: 'srgb', channels: bg });
		node.inputs.reference.setValue({ space: 'srgb', channels: ref });

		await node.run();

		const output = getAllOutputs(node);

		const expColor = { space: 'srgb', channels: fg, alpha: 1 };

		expect(output.inRange).to.equal(false);
		expect(output.color as Color).to.deep.equal(expColor);
		expect(Number.isNaN(output.alpha)).toEqual(true);
	});
});
