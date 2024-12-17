import { Graph } from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { describe, expect, test } from 'vitest';
import Node from '../src/nodes/publish.js';

describe('nodes/publish', () => {
	test('sets token to be published', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '#ff0000',
			type: 'color'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.publish.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					hiddenFromPublishing: false
				}
			}
		});
	});

	test('sets token to be hidden', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '#ff0000',
			type: 'color'
		} as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.publish.setValue(false);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					hiddenFromPublishing: true
				}
			}
		});
	});

	test('preserves existing extensions', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const mockToken = {
			name: 'test',
			value: '#ff0000',
			type: 'color',
			$extensions: {
				'com.figma': {
					otherProp: true
				},
				'other.extension': {
					someProp: 'value'
				}
			}
		} as unknown as SingleToken;

		node.inputs.token.setValue(mockToken);
		node.inputs.publish.setValue(true);

		await node.execute();

		expect(node.outputs.token.value).toEqual({
			...mockToken,
			$extensions: {
				'com.figma': {
					otherProp: true,
					hiddenFromPublishing: false
				},
				'other.extension': {
					someProp: 'value'
				}
			}
		});
	});
});
