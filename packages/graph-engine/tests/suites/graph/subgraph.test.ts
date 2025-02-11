import { Graph } from '../../../src/graph/graph.js';
import { describe, expect, it, vi } from 'vitest';
import SubgraphNode from '../../../src/nodes/generic/subgraph.js';

describe('SubgraphNode', () => {
	it('should pass the parent externalLoader to the subgraph', async () => {
		const graph = new Graph();

		// Create a mock external loader
		const mockExternalLoader = vi.fn(async () => {
			return 'external value';
		});

		// Set it on the parent graph
		graph.externalLoader = mockExternalLoader;

		// Create a SubgraphNode (which should inherit the loader)
		const subgraphNode = new SubgraphNode({ graph });

		// Ensure the _innerGraph now has the same externalLoader
		expect(subgraphNode._innerGraph.externalLoader).toBe(mockExternalLoader);
	});
});
