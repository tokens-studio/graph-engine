import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import { getAllOutputs } from '../utils.js';
import Node from '../../../../src/nodes/color/convert.js';

describe('color/convert', () => {
	it('converts csslike colors to rgb', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue('red');
		node.inputs.space.setValue('rgb');

		await node.execute();

		expect(getAllOutputs(node)).to.eql({
			a: 255,
			b: 0,
			c: 0,
			channels: [255, 0, 0, undefined],
			d: undefined,
			labels: ['r', 'g', 'b', 'alpha']
		});
	});

	it('converts csslike colors to gl', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue('red');
		node.inputs.space.setValue('gl');

		await node.execute();

		expect(getAllOutputs(node)).to.eql({
			a: 255,
			b: 0,
			c: 0,
			channels: [255, 0, 0, undefined],
			d: undefined,
			labels: ['r', 'g', 'b', 'alpha']
		});
	});

	it('converts to p3 from hex', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue('#52F234');
		node.inputs.space.setValue('p3');

		await node.execute();

		expect(getAllOutputs(node)).to.eql({
			a: 0.513799063361875,
			b: 0.9363407960900638,
			c: 0.3440788676962286,
			channels: [
				0.513799063361875,
				0.9363407960900638,
				0.3440788676962286,
				undefined
			],
			d: undefined,
			labels: ['r', 'g', 'b', 'alpha']
		});
	});

	it('converts to oklab from hex', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue('#52F234');
		node.inputs.space.setValue('oklab');

		await node.execute();
		expect(getAllOutputs(node)).to.eql({
			a: 0.8446731133698594,
			b: -0.19979243108966394,
			c: 0.16178227223673358,
			channels: [
				0.8446731133698594,
				-0.19979243108966394,
				0.16178227223673358,
				undefined
			],
			d: undefined,
			labels: ['l', 'a', 'b', 'alpha']
		});
	});

	it('converts to oklab from oklab', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue('oklab(40.1% 0.1143 0.045)');
		node.inputs.space.setValue('cubehelix');

		await node.execute();

		expect(getAllOutputs(node)).to.eql({
			a: -11.61375995607493,
			b: 0.7511787849960817,
			c: 0.2469609193911593,
			channels: [
				-11.61375995607493,
				0.7511787849960817,
				0.2469609193911593,
				undefined
			],
			d: undefined,
			labels: ['h', 's', 'l', 'alpha']
		});
	});
});
