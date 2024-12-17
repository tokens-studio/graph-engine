import { Graph } from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { describe, expect, test } from 'vitest';
import Node from '../src/nodes/scopeString.js';

describe('nodes/scopeString', () => {
	test('adds single font family scope', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: 'Inter',
			type: 'other'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.fontFamily.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['FONT_FAMILY']
				}
			}
		});
	});

	test('adds multiple scopes', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: 'Bold',
			type: 'other'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.fontStyle.setValue(true);
		node.inputs.textContent.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['FONT_STYLE', 'TEXT_CONTENT']
				}
			}
		});
	});

	test('preserves existing scopes and extensions', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: 'Inter',
			type: 'other',
			$extensions: {
				'com.figma': {
					scopes: ['TEXT_CONTENT'],
					otherProp: true
				},
				'other.extension': {
					someProp: 'value'
				}
			}
		} as unknown as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.fontFamily.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['TEXT_CONTENT', 'FONT_FAMILY'],
					otherProp: true
				},
				'other.extension': {
					someProp: 'value'
				}
			}
		});
	});

	test('adds all string-related scopes', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: 'Inter',
			type: 'other'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.fontFamily.setValue(true);
		node.inputs.fontStyle.setValue(true);
		node.inputs.textContent.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: ['FONT_FAMILY', 'FONT_STYLE', 'TEXT_CONTENT']
				}
			}
		});
	});

	test('handles no scopes selected', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: 'Inter',
			type: 'other'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		// All boolean inputs default to false

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					scopes: []
				}
			}
		});
	});
});
