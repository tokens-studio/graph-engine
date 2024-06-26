import { ColorSpaceTypes } from '@tokens-studio/types';
import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node, { ColorModifierTypes } from '../../../../src/nodes/color/blend.js';

describe('color/blend', () => {
	it('darkens the color correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue('red');
		node.inputs.space.setValue(ColorSpaceTypes.SRGB);
		node.inputs.modifierType.setValue(ColorModifierTypes.DARKEN);
		node.inputs.value.setValue(0.5);

		await node.execute();
		const output = node.outputs.value.value;
		expect(output).to.equal('#800000');
	});

	it('lightens the color correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue('red');
		node.inputs.space.setValue(ColorSpaceTypes.SRGB);
		node.inputs.modifierType.setValue(ColorModifierTypes.LIGHTEN);
		node.inputs.value.setValue(0.5);
		await node.execute();
		const output = node.outputs.value.value;
		expect(output).to.equal('#ff8080');
	});
});
