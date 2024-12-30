import { Graph } from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { describe, expect, it } from 'vitest';
import UngroupArrayNode from '../../src/nodes/arrays/ungroup.js';

describe('UngroupArrayNode', () => {
	it('should remove namespace from token names', async () => {
		const graph = new Graph();
		const node = new UngroupArrayNode({ graph });

		const tokens = [
			{ name: 'theme.color', value: '#ff0000', type: 'color' },
			{ name: 'theme.size', value: '16px', type: 'dimension' },
			{ name: 'other.value', value: '20px', type: 'dimension' }
		] as SingleToken[];

		node.inputs.name.setValue('theme');
		node.inputs.tokens.setValue(tokens);
		await node.execute();

		expect(node.outputs.tokens.value).toEqual([
			{ name: 'color', value: '#ff0000', type: 'color' },
			{ name: 'size', value: '16px', type: 'dimension' }
		]);
	});
});
