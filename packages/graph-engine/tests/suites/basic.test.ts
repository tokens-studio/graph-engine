import {
	Graph,
	NodeFactory,
	SerializedGraph,
	nodeLookup
} from '../../src/index.js';
import { describe, expect, test } from 'vitest';
import basic from '../data/processed/basic.js';

describe('basic', () => {
	test('performs basic passthrough calculations', async () => {
		const graph = await new Graph().deserialize(
			basic as unknown as SerializedGraph,
			nodeLookup as Record<string, NodeFactory>
		);

		const result = await graph.execute();
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
