import { Graph } from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { describe, expect, test } from 'vitest';
import ScopeTokenArrayByType from '../src/nodes/scopeTokenArrayByType.js';

describe('nodes/scopeTokenArrayByType', () => {
	test('adds color scopes to color tokens in array', async () => {
		const graph = new Graph();
		const node = new ScopeTokenArrayByType({ graph });

		const mockToken = {
			name: 'test',
			value: '#ff0000',
			type: 'color'
		} as SingleToken;

		node.inputs.tokens.setValue([mockToken]);
		await node.execute();

		expect(node.outputs.tokens.value).toEqual([
			{
				...mockToken,
				$extensions: {
					'com.figma': {
						scopes: ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR']
					}
				}
			}
		]);
	});

	test('adds dimension scopes to dimension tokens in array', async () => {
		const graph = new Graph();
		const node = new ScopeTokenArrayByType({ graph });

		const mockToken = {
			name: 'test',
			value: '16px',
			type: 'dimension'
		} as SingleToken;

		node.inputs.tokens.setValue([mockToken]);
		await node.execute();

		expect(node.outputs.tokens.value).toEqual([
			{
				...mockToken,
				$extensions: {
					'com.figma': {
						scopes: [
							'GAP',
							'WIDTH_HEIGHT',
							'CORNER_RADIUS',
							'STROKE_FLOAT',
							'EFFECT_FLOAT',
							'PARAGRAPH_INDENT'
						]
					}
				}
			}
		]);
	});

	test('preserves existing extensions and merges scopes for tokens in array', async () => {
		const graph = new Graph();
		const node = new ScopeTokenArrayByType({ graph });

		const mockToken = {
			name: 'test',
			value: '#ff0000',
			type: 'color',
			$extensions: {
				'com.figma': {
					scopes: ['TEXT_FILL'],
					otherProp: true
				},
				'other.extension': {
					someProp: 'value'
				}
			}
		} as unknown as SingleToken;

		node.inputs.tokens.setValue([mockToken]);
		await node.execute();

		expect(node.outputs.tokens.value).toEqual([
			{
				...mockToken,
				$extensions: {
					'com.figma': {
						scopes: ['TEXT_FILL', 'ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'],
						otherProp: true
					},
					'other.extension': {
						someProp: 'value'
					}
				}
			}
		]);
	});
});
