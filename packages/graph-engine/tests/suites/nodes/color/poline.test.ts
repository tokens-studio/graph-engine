import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/color/poline.js';

describe('color/poline', () => {
	test('creates the expected color palette with these inputs 1', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.anchorColors.setValue([
			{
				space: 'srgb',
				channels: [1, 0, 0]
			},
			{
				space: 'srgb',
				channels: [0, 1, 0]
			}
		]);
		node.inputs.numPoints.setValue(2);
		node.inputs.hueShift.setValue(20);
		node.inputs.positionFnX.setValue('linearPosition');
		await node.execute();

		const output = node.outputs.value.value;

		expect(output).to.deep.equal([
			{
				channels: [20, 100, 50],
				space: 'hsl'
			},
			{
				channels: [52.99549801404953, 100, 30.829648121589752],
				space: 'hsl'
			},
			{
				channels: [108.14643105799234, 100, 31.701328706835056],
				space: 'hsl'
			},
			{
				channels: [140, 100, 50],
				space: 'hsl'
			}
		]);
	});

	test('creates the expected color palette with these inputs 2', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.anchorColors.setValue([
			{
				space: 'srgb',
				channels: [1, 0, 0]
			},
			{
				space: 'srgb',
				channels: [0, 1, 0]
			}
		]);
		node.inputs.numPoints.setValue(6);
		node.inputs.invertedLightness.setValue(true);
		node.inputs.hueShift.setValue(20);
		node.inputs.positionFnY.setValue('arcPosition');
		await node.execute();

		const output = node.outputs.value.value;

		expect(output).to.deep.equal([
			{
				channels: [200, 100, -48],
				space: 'hsl'
			},
			{
				channels: [213.0415731895488, 100, -31.741504942736952],
				space: 'hsl'
			},
			{
				channels: [242.812654059009, 100, -20.406039545087694],
				space: 'hsl'
			},
			{
				channels: [286.5964972422866, 100, -20.240905322057483],
				space: 'hsl'
			},
			{
				channels: [311.4579492123546, 100, -28.15311658105302],
				space: 'hsl'
			},
			{
				channels: [321.0882152758742, 100, -36.6025187088609],
				space: 'hsl'
			},
			{
				channels: [323.8129664436686, 100, -42.91139921197519],
				space: 'hsl'
			},
			{
				channels: [320, 100, -48],
				space: 'hsl'
			}
		]);
	});

	test('creates the expected color palette with two color inputs and a given state', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.anchorColors.setValue([
			{
				space: 'srgb',
				channels: [1, 0, 0]
			},
			{
				space: 'srgb',
				channels: [0, 1, 0]
			}
		]);
		node.inputs.numPoints.setValue(2);
		node.inputs.hueShift.setValue(20);
		node.inputs.positionFnX.setValue('linearPosition');
		await node.execute();

		const output = node.outputs.value.value;

		expect(output).to.deep.equal([
			{
				channels: [20, 100, 50],
				space: 'hsl'
			},
			{
				channels: [52.99549801404953, 100, 30.829648121589752],
				space: 'hsl'
			},
			{
				channels: [108.14643105799234, 100, 31.701328706835056],
				space: 'hsl'
			},
			{
				channels: [140, 100, 50],
				space: 'hsl'
			}
		]);
	});
});
