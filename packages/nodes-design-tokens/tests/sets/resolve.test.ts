import {
	DeepKeyTokenMap,
	SingleBorderToken,
	SingleBoxShadowToken,
	SingleTypographyToken,
	TokenTypes
} from '@tokens-studio/types';
import { Graph } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import { flatten } from '../../src/utils/index.js';
import Node from '../../src/nodes/resolve.js';

describe('node/resolve', () => {
	test('resolves complex values correctly', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.inputs.setValue(
			flatten({
				'ref-border': {
					value: '{border}',
					type: TokenTypes.BORDER,
					description: ''
				},
				'ref-box': {
					value: '{box}',
					type: TokenTypes.BOX_SHADOW,
					description: ''
				},
				'ref-typo': {
					value: '{typo}',
					type: TokenTypes.TYPOGRAPHY,
					description: ''
				}
			} as unknown as DeepKeyTokenMap)
		);
		node.inputs.context.setValue(
			flatten({
				border: {
					value: {
						color: '#ff5757',
						style: 'dashed',
						width: '2px'
					},
					type: 'border',
					description: ''
				} as SingleBorderToken,
				box: {
					value: [
						{
							color: '#eb0000',
							type: 'dropShadow',
							x: '14',
							y: '51'
						}
					],
					type: TokenTypes.BOX_SHADOW,
					description: ''
				} as SingleBoxShadowToken,
				typo: {
					value: {
						lineHeight: '1.5',
						fontFamily: 'Inter',
						fontWeight: '500'
					},
					type: TokenTypes.TYPOGRAPHY,
					description: ''
				} as SingleTypographyToken
			})
		);

		await node.execute();

		const output = node.outputs.value.value;

		expect(output).toEqual([
			{
				description: '',
				name: 'ref-border',
				type: 'border',
				value: {
					color: '#ff5757',
					style: 'dashed',
					width: '2px'
				}
			},
			{
				name: 'ref-box',
				description: '',
				type: 'boxShadow',
				value: [
					{
						color: '#eb0000',
						type: 'dropShadow',
						x: 14,
						y: 51
					}
				]
			},
			{
				description: '',
				name: 'ref-typo',
				type: 'typography',
				value: {
					lineHeight: 1.5,
					fontFamily: 'Inter',
					fontWeight: 500
				}
			}
		]);
	});
});
