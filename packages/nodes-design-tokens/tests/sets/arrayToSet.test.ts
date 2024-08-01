import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/arrayToSet.js';

describe('node/arrayToSet', () => {
	test('converts to a nested object correctly', async () => {
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
		];

		node.inputs.tokens.setValue(tokens);

		await node.execute();

		const output = node.outputs.tokenSet.value;

		expect(output).toEqual({
			global: {
				viking: {
					light: {
						background: {
							value: '#fcc',
							type: 'color'
						}
					},
					dark: {
						background: {
							value: '#300',
							type: 'color'
						}
					}
				},
				knight: {
					light: {
						background: {
							value: '#cfc',
							type: 'color'
						}
					},
					dark: {
						background: {
							value: '#003301',
							type: 'color'
						}
					}
				},
				samurai: {
					light: {
						background: {
							value: '#efccff',
							type: 'color'
						}
					},
					dark: {
						background: {
							value: '#240033',
							type: 'color'
						}
					}
				}
			}
		});
	});
});
