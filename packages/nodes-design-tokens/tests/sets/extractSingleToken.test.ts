import { Graph } from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/extractSingleToken.js';

describe('node/extractSingleToken', () => {
	test('finds a token if it exists', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const tokens = [
			{
				name: 'global.viking.light.background',
				value: '#fcc',
				type: 'color'
			},
			{
				name: 'global.viking.dark.background',
				value: '#300',
				type: 'color'
			},
			{
				name: 'global.knight.light.background',
				value: '#cfc',
				type: 'color'
			},
			{
				name: 'global.knight.dark.background',
				value: '#003301',
				type: 'color'
			},
			{
				name: 'global.samurai.light.background',
				value: '#efccff',
				type: 'color'
			},
			{
				name: 'global.samurai.dark.background',
				value: '#240033',
				type: 'color'
			}
		] as SingleToken[];

		node.inputs.tokens.setValue(tokens);
		node.inputs.name.setValue('global.knight.light.background');

		await node.execute();

		expect(node.outputs.found.value).toEqual(true);
		expect(node.outputs.token.value).toEqual({
			name: 'global.knight.light.background',
			type: 'color',
			value: '#cfc'
		});
	});
	test('indicates correctly if a token does not exist', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const tokens = [
			{
				name: 'global.viking.light.background',
				value: '#fcc',
				type: 'color'
			},
			{
				name: 'global.viking.dark.background',
				value: '#300',
				type: 'color'
			},
			{
				name: 'global.knight.light.background',
				value: '#cfc',
				type: 'color'
			},
			{
				name: 'global.knight.dark.background',
				value: '#003301',
				type: 'color'
			},
			{
				name: 'global.samurai.light.background',
				value: '#efccff',
				type: 'color'
			},
			{
				name: 'global.samurai.dark.background',
				value: '#240033',
				type: 'color'
			}
		] as SingleToken[];

		node.inputs.tokens.setValue(tokens);
		node.inputs.name.setValue('global.cyber.light.background.missing');

		await node.execute();

		expect(node.outputs.found.value).toEqual(false);
		expect(node.outputs.token.value).toEqual(undefined);
	});
});
