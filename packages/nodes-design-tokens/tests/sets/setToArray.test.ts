import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import Node from '../../src/nodes/setToArray.js';

describe('node/setToArray', () => {
	test('converts to a flat array correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.tokenSet.setValue({
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

		await node.execute();

		const output = node.outputs.tokens.value;

		expect(output).toEqual([
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
		]);
	});
});
