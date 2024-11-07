import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/curves/flipFloatCurve.js';

describe('curves/flipFloatCurve', () => {
	const sampleCurve = {
		segments: [
			[0, 0],
			[1, 1]
		],
		controlPoints: [
			[
				[0.25, 0.1],
				[0.75, 0.9]
			]
		]
	};

	test('flips curve horizontally', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue(sampleCurve);
		node.inputs.flipHorizontal.setValue(true);
		node.inputs.flipVertical.setValue(false);

		await node.execute();

		const result = node.outputs.curve.value;
		expect(result.segments).to.eql([
			[1, 0],
			[0, 1]
		]);
		expect(result.controlPoints).to.eql([
			[
				[0.75, 0.1],
				[0.25, 0.9]
			]
		]);
	});

	test('flips curve vertically', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue(sampleCurve);
		node.inputs.flipHorizontal.setValue(false);
		node.inputs.flipVertical.setValue(true);

		await node.execute();

		const result = node.outputs.curve.value;
		expect(result.segments).to.eql([
			[1, 0],
			[0, 1]
		]);
		expect(result.controlPoints).to.eql([
			[
				[0.75, 0.1],
				[0.25, 0.9]
			]
		]);
	});

	test('flips curve both horizontally and vertically', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue(sampleCurve);
		node.inputs.flipHorizontal.setValue(true);
		node.inputs.flipVertical.setValue(true);

		await node.execute();

		const result = node.outputs.curve.value;
		expect(result.segments).to.eql([
			[0, 0],
			[1, 1]
		]);
		expect(result.controlPoints).to.eql([
			[
				[0.25, 0.1],
				[0.75, 0.9]
			]
		]);
	});

	test('returns original curve when no flips are selected', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue(sampleCurve);
		node.inputs.flipHorizontal.setValue(false);
		node.inputs.flipVertical.setValue(false);

		await node.execute();

		expect(node.outputs.curve.value).to.eql(sampleCurve);
	});
});
