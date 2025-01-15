import { Graph, SerializedGraph, nodeLookup } from '../../../src/index.js';
import { describe, expect, test } from 'vitest';

describe('Loader', () => {
	test('handles async loading of nodes', async () => {
		const serialized = {
			nodes: [
				{
					id: 'x',
					type: 'studio.tokens.generic.input',
					inputs: [
						{
							name: 'foo',
							type: {
								$id: 'https://schemas.tokens.studio/string.json',
								title: 'String',
								type: 'string'
							}
						}
					],
					annotations: {
						'engine.singleton': true,
						'engine.dynamicInputs': true
					}
				},
				{
					id: 'y',
					type: 'studio.tokens.generic.output',
					inputs: [
						{
							name: 'input',
							value: 'black',
							type: {
								$id: 'https://schemas.tokens.studio/string.json',
								title: 'String',
								type: 'string'
							}
						}
					],
					annotations: {
						'engine.singleton': true,
						'engine.dynamicInputs': true
					}
				}
			],
			edges: [],
			annotations: {
				'engine.id': '5dc7b415-9e46-455c-9375-2380b7fbdfa5',
				'engine.version': '0.12.0'
			}
		} as SerializedGraph;

		const nodeLoader = async key => {
			return Promise.resolve(nodeLookup[key]);
		};

		const newGraph = await new Graph().deserialize(serialized, nodeLoader);
		const deserializedOutput = await newGraph.execute();

		expect(deserializedOutput.output).to.eql({
			input: {
				type: {
					$id: 'https://schemas.tokens.studio/string.json',
					title: 'String',
					type: 'string'
				},
				value: 'black'
			}
		});
	});
});
