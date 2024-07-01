import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/color/poline.js';

describe('color/poline', () => {
	it('creates the expected color palette with these inputs 1', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.anchorColors.setValue(['#ff0000', '#00ff00']);
		node.inputs.numPoints.setValue(2);
		node.inputs.hueShift.setValue(20);
		node.inputs.positionFnX.setValue('linearPosition');
		await node.execute();

		const output = node.outputs.value.value;

		expect(output).to.eql(['#ff5500', '#9d8b00', '#20a200', '#00ff55']);
	});

	it('creates the expected color palette with these inputs 2', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.anchorColors.setValue(['#ff0000', '#00ff00']);
		node.inputs.numPoints.setValue(6);
		node.inputs.invertedLightness.setValue(true);
		node.inputs.hueShift.setValue(20);
		node.inputs.positionFnY.setValue('arcPosition');
		await node.execute();

		const output = node.outputs.value.value;

		expect(output).to.eql([
			'#ff5500',
			'#ffb255',
			'#faff90',
			'#a9ff90',
			'#67ff84',
			'#3bff80',
			'#1aff75',
			'#00ff55'
		]);
	});

	it('creates the expected color palette with two color inputs and a given state', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.anchorColors.setValue(['#ff0000', '#00ff00']);
		node.inputs.numPoints.setValue(2);
		node.inputs.hueShift.setValue(20);
		node.inputs.positionFnX.setValue('linearPosition');
		await node.execute();

		const output = node.outputs.value.value;

		expect(output).to.eql(['#ff5500', '#9d8b00', '#20a200', '#00ff55']);
	});
});
