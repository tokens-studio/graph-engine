import { Graph } from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { describe, expect, test } from 'vitest';
import Node from '../src/nodes/scopeNumber.js';

describe('nodes/scopeNumber', () => {
	test('adds single scope to token', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '16',
			type: 'number'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.fontSize.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['FONT_SIZE']
				}
			}
		});
	});

	test('adds multiple font-related scopes', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '16',
			type: 'number'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.fontSize.setValue(true);
		node.inputs.fontWeight.setValue(true);
		node.inputs.lineHeight.setValue(true);
		node.inputs.letterSpacing.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['FONT_WEIGHT', 'FONT_SIZE', 'LINE_HEIGHT', 'LETTER_SPACING']
				}
			}
		});
	});

	test('adds multiple layout-related scopes', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '8',
			type: 'number'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.gapBetween.setValue(true);
		node.inputs.padding.setValue(true);
		node.inputs.cornerRadius.setValue(true);
		node.inputs.widthAndHeight.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['GAP', 'CORNER_RADIUS', 'WIDTH_HEIGHT']
				}
			}
		});
	});

	test('preserves existing scopes and extensions', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '16',
			type: 'number',
			$extensions: {
				'com.figma': {
					scopes: ['OPACITY'],
					otherProp: true
				},
				'other.extension': {
					someProp: 'value'
				}
			}
		} as unknown as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.fontSize.setValue(true);
		node.inputs.lineHeight.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['OPACITY', 'FONT_SIZE', 'LINE_HEIGHT'],
					otherProp: true
				},
				'other.extension': {
					someProp: 'value'
				}
			}
		});
	});

	test('handles all effect and stroke scopes', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '0.5',
			type: 'number'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.effects.setValue(true);
		node.inputs.stroke.setValue(true);
		node.inputs.layerOpacity.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['OPACITY', 'EFFECT_FLOAT', 'STROKE_FLOAT']
				}
			}
		});
	});

	test('handles all paragraph-related scopes', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '24',
			type: 'number'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.paragraphSpacing.setValue(true);
		node.inputs.paragraphIndent.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['PARAGRAPH_SPACING', 'PARAGRAPH_INDENT']
				}
			}
		});
	});
});
