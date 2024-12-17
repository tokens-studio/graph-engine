import {
	Graph,
	NodeFactory,
	SerializedGraph,
	nodeLookup
} from '../../src/index.js';
import { describe, expect, test } from 'vitest';
import loading from '../data/processed/loading.js';

describe('loading', () => {
	test('load resource from graph', async () => {
		const graph = await new Graph().deserialize(
			loading as unknown as SerializedGraph,
			nodeLookup as Record<string, NodeFactory>
		);

		const result = await graph.execute();

        expect(result.output).to.eql();
	});
});
