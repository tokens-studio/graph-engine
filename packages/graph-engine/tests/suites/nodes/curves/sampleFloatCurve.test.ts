import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/curves/sampleFloatCurve.js';

describe('curves/sampleFloatCurve', () => {
	const sampleCurve = {
		segments: [
			[0, 0],
			[0.5, 0.8],
			[1, 1]
		],
		controlPoints: [
			[
				[0.2, 0.3],
				[0.4, 0.7]
			],
			[
				[0.6, 0.85],
				[0.8, 0.95]
			]
		]
	};

	test('samples at regular x intervals', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue(sampleCurve);
		node.inputs.samples.setValue(5);

		await node.execute();

		const values = node.outputs.values.value;
		expect(values).to.have.lengthOf(5);
		// Sample points should be at x = 0, 0.25, 0.5, 0.75, 1
		expect(values[0]).to.equal(0); // Value at x=0
		expect(values[2]).to.be.approximately(0.8, 0.1); // Value at x=0.5
		expect(values[4]).to.equal(1); // Value at x=1
	});

	test('respects precision setting', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue(sampleCurve);
		node.inputs.samples.setValue(5);
		node.inputs.precision.setValue(1);

		await node.execute();

		const values = node.outputs.values.value;
		values.forEach(value => {
			const decimalPlaces = value.toString().split('.')[1]?.length || 0;
			expect(decimalPlaces).to.be.lessThanOrEqual(1);
		});
	});

	test('handles minimum samples (2)', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue(sampleCurve);
		node.inputs.samples.setValue(2);

		await node.execute();

		const values = node.outputs.values.value;
		expect(values).to.have.lengthOf(2);
		expect(values[0]).to.equal(0); // Start point
		expect(values[1]).to.equal(1); // End point
	});

	test('samples complex curve correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.curve.setValue({
			segments: [
				[0, 1],
				[0.3, 0.2],
				[0.7, 0.8],
				[1, 0]
			],
			controlPoints: [
				[
					[0.1, 0.8],
					[0.2, 0.4]
				],
				[
					[0.4, 0.3],
					[0.6, 0.7]
				],
				[
					[0.8, 0.6],
					[0.9, 0.2]
				]
			]
		});
		node.inputs.samples.setValue(4);

		await node.execute();

		const values = node.outputs.values.value;
		expect(values).to.have.lengthOf(4);
		expect(values[0]).to.equal(1); // Start value
		expect(values[3]).to.equal(0); // End value
	});
});
