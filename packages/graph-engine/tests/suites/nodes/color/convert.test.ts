import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import { getAllOutputs } from '../utils.js';
import Node from '../../../../src/nodes/color/convert.js';

describe('color/convert', () => {
	it('converts csslike colors to rgb', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue({
			space: 'srgb',
			channels: [1, 0, 0]
		});
		node.inputs.space.setValue('lab');

		await node.execute();

		expect(getAllOutputs(node)).to.deep.equal({
			color: {
				alpha: 1,
				channels: [54.29054140467191, 80.80492817043522, 69.89096476862429],
				space: 'Lab'
			}
		});
	});

	it('converts csslike colors to a98rgb', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue({
			space: 'srgb',
			channels: [1, 0, 0]
		});
		node.inputs.space.setValue('a98rgb');

		await node.execute();

		expect(getAllOutputs(node)).to.deep.equal({
			color: {
				alpha: 1,
				channels: [0.8585916022954422, 8.152862362272588e-9, 0],
				space: 'Adobe® 98 RGB compatible'
			}
		});
	});

	it('converts to p3 from hex', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue({
			space: 'srgb',
			channels: [1, 0, 0]
		});
		node.inputs.space.setValue('p3');

		await node.execute();

		expect(getAllOutputs(node)).to.deep.equal({
			color: {
				alpha: 1,
				channels: [
					0.9174875573251656, 0.20028680774084717, 0.13856059121111405
				],
				space: 'P3'
			}
		});
	});

	it('converts to oklab from hex', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue({
			space: 'srgb',
			channels: [0.3, 0.4, 0.2]
		});
		node.inputs.space.setValue('oklab');

		await node.execute();
		expect(getAllOutputs(node)).to.deep.equal({
			color: {
				alpha: 1,
				channels: [
					0.4767656277225901, -0.05333477044742116, 0.06192370329969671
				],
				space: 'Oklab'
			}
		});
	});

	it('converts to oklab from xyz', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue({
			space: 'oklab',
			channels: [0.3, 0.4, 0.2]
		});
		node.inputs.space.setValue('xyz-d65');

		await node.execute();

		expect(getAllOutputs(node)).to.deep.equal({
			color: {
				alpha: 1,
				space: 'XYZ D65',
				channels: [
					0.14672204396323899, 0.011234589220921708, -0.015842642806276265
				]
			}
		});
	});
});
