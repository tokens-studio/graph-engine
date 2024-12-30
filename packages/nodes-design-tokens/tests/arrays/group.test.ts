import { Graph } from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { describe, expect, it } from 'vitest';
import GroupArrayNode from '../../src/nodes/arrays/group.js';

describe('GroupArrayNode', () => {
	it('should add namespace to token names', async () => {
		const graph = new Graph();
		const node = new GroupArrayNode({ graph });

		const tokens = [
			{ name: 'color', value: '#ff0000', type: 'color' },
			{ name: 'size', value: '16px', type: 'dimension' }
		] as SingleToken[];

		node.inputs.name.setValue('theme');
		node.inputs.tokens.setValue(tokens);
		await node.execute();

		expect(node.outputs.tokens.value).toEqual([
			{ name: 'theme.color', value: '#ff0000', type: 'color' },
			{ name: 'theme.size', value: '16px', type: 'dimension' }
		]);
	});
});
