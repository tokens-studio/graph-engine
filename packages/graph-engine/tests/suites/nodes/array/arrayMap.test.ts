import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, it, vi } from 'vitest';
import ArraySubgraph from '../../../../src/nodes/array/arraySubgraph.js';

describe('ArraySubgraph', () => {
	it('should pass the parent externalLoader to the inner graph', async () => {
		const graph = new Graph();

		// Create a mock external loader
		const mockExternalLoader = vi.fn(async () => {
			return 'external value';
		});

		// Set it on the parent graph
		graph.externalLoader = mockExternalLoader;

		// Create an ArraySubgraph node (which should inherit the loader)
		const arraySubgraphNode = new ArraySubgraph({ graph });

		// Ensure the _innerGraph now has the same externalLoader
		expect(arraySubgraphNode._innerGraph.externalLoader).toBe(
			mockExternalLoader
		);
	});
});
