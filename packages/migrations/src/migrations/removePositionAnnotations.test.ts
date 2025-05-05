import { describe, expect, it } from 'vitest';
import { removePositionAnnotations } from './removePositionAnnotations.js';
import type {
	SerializedEdge,
	SerializedGraph,
	SerializedNode
} from '@tokens-studio/graph-engine';

describe('removePositionAnnotations', () => {
	it('should remove only xpos and ypos from node annotations', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [
				{
					id: 'node1',
					type: 'test-node',
					inputs: [],
					annotations: {
						xpos: 100,
						ypos: 200,
						otherAnno: 'keep-me'
					}
				},
				{
					id: 'node2',
					type: 'test-node',
					inputs: [],
					annotations: {
						keepMe: 'also'
					}
				}
			],
			edges: []
		};

		const result = await removePositionAnnotations(graph);

		const node1Result = result.nodes.find(node => node.id === 'node1');
		expect(node1Result).toBeDefined();
		expect(node1Result!.annotations).toBeDefined();
		expect(node1Result!.annotations?.xpos).toBeUndefined();
		expect(node1Result!.annotations?.ypos).toBeUndefined();
		expect(node1Result!.annotations?.otherAnno).toBe('keep-me');

		const node2Result = result.nodes.find(node => node.id === 'node2');
		expect(node2Result).toBeDefined();
		expect(node2Result!.annotations).toEqual({ keepMe: 'also' });
	});

	it('should handle nodes with empty annotations object', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [
				{
					id: 'node-empty-annotation',
					type: 'test-empty-annotation',
					inputs: [],
					annotations: {}
				}
			],
			edges: []
		};

		const initialGraph = JSON.parse(JSON.stringify(graph));
		const result = await removePositionAnnotations(graph);
		expect(result).toEqual(initialGraph);
		expect(result.nodes[0].annotations).toEqual({});
	});

	it('should handle nodes missing the annotations property', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [
				{
					id: 'node-no-annotation',
					type: 'test-no-annotation',
					inputs: []
				}
			],
			edges: []
		};

		const initialGraph = JSON.parse(JSON.stringify(graph));
		const result = await removePositionAnnotations(graph);
		expect(result).toEqual(initialGraph);
		expect(result.nodes[0].annotations).toBeUndefined();
	});

	it('should handle graph with no nodes', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [],
			edges: []
		};

		const result = await removePositionAnnotations(graph);
		expect(result.nodes).toEqual([]);
	});

	it('should handle null or undefined nodes in the array', async () => {
		const graph: {
			annotations: Record<string, unknown>;
			nodes: (SerializedNode | null | undefined)[];
			edges: SerializedEdge[];
		} = {
			annotations: {},
			nodes: [
				{
					id: 'node1',
					type: 'test-node',
					inputs: [],
					annotations: { xpos: 50, keep: 'this' }
				},
				null,
				undefined,
				{
					id: 'node2',
					type: 'test-node-2',
					inputs: [],
					annotations: { ypos: 60 }
				}
			],
			edges: []
		};

		const result = await removePositionAnnotations(graph as SerializedGraph);
		expect(result.nodes.length).toBe(4);

		const node1Result = result.nodes.find(node => node?.id === 'node1');
		expect(node1Result).toBeDefined();
		expect(node1Result!.annotations?.xpos).toBeUndefined();
		expect(node1Result!.annotations?.keep).toBe('this');

		const node2Result = result.nodes.find(node => node?.id === 'node2');
		expect(node2Result).toBeDefined();
		expect(node2Result!.annotations?.ypos).toBeUndefined();
	});
});
