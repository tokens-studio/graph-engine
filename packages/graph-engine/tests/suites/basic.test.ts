import { NodeFactory, SerializedGraph, nodeLookup } from '../../src/index.js';
import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import basic from '../data/processed/basic.js';

describe('basic', () => {
	test('performs basic passthrough calculations', async () => {
		const dataflow = getDataFlowGraph();

		const graph = await dataflow.deserialize(
			basic as unknown as SerializedGraph,
			nodeLookup as Record<string, NodeFactory>
		);

		const result = await graph.capabilities.dataFlow.execute();
		expect(result.output).to.eql({
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
