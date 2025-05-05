import { describe, expect, it } from 'vitest';
import { removeRedundantInputValues } from './removeRedundantInputValues.js';
import type {
	SerializedEdge,
	SerializedGraph,
	SerializedNode,
	TypeDefinition
} from '@tokens-studio/graph-engine';

const MockStringType: TypeDefinition = {
	type: { type: 'string', title: 'Mock String' }
};
const MockArrayType: TypeDefinition = {
	type: { type: 'array', title: 'Mock Array', items: MockStringType.type }
};

describe('removeRedundantInputValues', () => {
	it('should remove input values for connected, non-variadic ports', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [
				{
					id: 'node1',
					type: 'test-node',
					inputs: [
						{
							name: 'input1',
							value: 'value1',
							type: MockStringType,
							visible: true
						},
						{
							name: 'input2',
							value: 'value2',
							type: MockStringType,
							visible: true
						},
						{
							name: 'input3',
							value: 'value3',
							type: MockArrayType,
							visible: true,
							variadic: true
						}
					],
					annotations: {}
				}
			],
			edges: [
				{
					id: 'edge2',
					source: 'sourceNode',
					sourceHandle: 'out',
					target: 'node1',
					targetHandle: 'input2'
				},
				{
					id: 'edge3',
					source: 'sourceNode',
					sourceHandle: 'out',
					target: 'node1',
					targetHandle: 'input3'
				}
			]
		};

		const result = await removeRedundantInputValues(graph);

		const node1Result = result.nodes.find(n => n.id === 'node1');
		expect(node1Result).toBeDefined();

		const input1 = node1Result!.inputs.find(i => i.name === 'input1');
		const input2 = node1Result!.inputs.find(i => i.name === 'input2');
		const input3 = node1Result!.inputs.find(i => i.name === 'input3');

		expect(input1?.value).toBe('value1');
		expect(input2?.value).toBeUndefined();
		expect('value' in input2!).toBe(false);
		expect(input3?.value).toBe('value3');
	});

	it('should handle nodes with no inputs', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [
				{
					id: 'node-no-inputs',
					type: 'test-no-inputs',
					inputs: [],
					annotations: {}
				}
			],
			edges: []
		};

		const initialGraph = JSON.parse(JSON.stringify(graph));
		const result = await removeRedundantInputValues(graph);
		expect(result).toEqual(initialGraph);
	});

	it('should handle graph with no nodes', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [],
			edges: []
		};

		const result = await removeRedundantInputValues(graph);
		expect(result.nodes).toEqual([]);
		expect(result.edges).toEqual([]);
	});

	it('should handle graph with only edges (no nodes)', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [],
			edges: [
				{
					id: 'edge1',
					source: 'a',
					sourceHandle: 'b',
					target: 'c',
					targetHandle: 'd'
				}
			]
		};

		const initialGraph = JSON.parse(JSON.stringify(graph));
		const result = await removeRedundantInputValues(graph);
		expect(result).toEqual(initialGraph);
	});

	it('should handle inputs missing the value property', async () => {
		const graph: SerializedGraph = {
			annotations: {},
			nodes: [
				{
					id: 'node-val-missing',
					type: 'test-val-missing',
					inputs: [
						{ name: 'input1', type: MockStringType, visible: true },
						{
							name: 'input2',
							type: MockArrayType,
							visible: true,
							variadic: true
						}
					],
					annotations: {}
				}
			],
			edges: [
				{
					id: 'edge1',
					source: 's',
					sourceHandle: 'o',
					target: 'node-val-missing',
					targetHandle: 'input1'
				},
				{
					id: 'edge2',
					source: 's',
					sourceHandle: 'o',
					target: 'node-val-missing',
					targetHandle: 'input2'
				}
			]
		};

		const initialGraph = JSON.parse(JSON.stringify(graph));
		const result = await removeRedundantInputValues(graph);
		expect(result).toEqual(initialGraph);
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
					inputs: [
						{
							name: 'input2',
							value: 'value2',
							type: MockStringType,
							visible: true
						}
					],
					annotations: {}
				},
				null,
				undefined
			],
			edges: [
				{
					id: 'edge2',
					source: 'sourceNode',
					sourceHandle: 'out',
					target: 'node1',
					targetHandle: 'input2'
				}
			]
		};

		const result = await removeRedundantInputValues(graph as SerializedGraph);
		expect(result.nodes.length).toBe(3);

		const node1Result = result.nodes.find(n => n?.id === 'node1');
		expect(node1Result).toBeDefined();

		const input2 = node1Result!.inputs.find(i => i.name === 'input2');
		expect(input2?.value).toBeUndefined();
		expect('value' in input2!).toBe(false);
	});
});
