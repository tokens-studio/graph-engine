import { Graph } from '../../../src/graph/graph.js';
import { Node } from '../../../src/programmatic/node.js';
import { NumberSchema } from '../../../src/schemas/index.js';
import { annotatedVariadicIndex } from '../../../src/annotations/index.js';
import { describe, expect, it } from 'vitest';
import { v4 as uuid } from 'uuid';

// Helper: create a numeric source node
function createSource(graph: Graph, val: number): Node {
	const node = new Node({ id: uuid(), graph });
	node.addOutput('out', { type: NumberSchema });
	node.outputs.out.set(val);
	graph.addNode(node);
	return node;
}

// Helper: create a target node with a variadic input
function createTarget(graph: Graph): Node {
	const node = new Node({ id: uuid(), graph });
	node.addInput('values', {
		type: {
			type: 'array',
			items: NumberSchema
		},
		variadic: true
	});
	graph.addNode(node);
	return node;
}

describe('Variadic Tests', () => {
	it('should throw on negative index', () => {
		const g = new Graph();
		const s = createSource(g, 100);
		const t = createTarget(g);
		expect(() => {
			g.connect(s, s.outputs.out, t, t.inputs.values, -2);
		}).toThrow('Invalid variadic index');
	});

	it('should append at -1', () => {
		const g = new Graph();
		const s1 = createSource(g, 10);
		const s2 = createSource(g, 20);
		const t = createTarget(g);

		// connect s1 at -1 => appended as index 0
		g.connect(s1, s1.outputs.out, t, t.inputs.values, -1);
		expect(t.inputs.values.value).toEqual([10]);

		// connect s2 at -1 => appended as index 1
		g.connect(s2, s2.outputs.out, t, t.inputs.values, -1);
		expect(t.inputs.values.value).toEqual([10, 20]);

		// check internal edges
		const edges = t.inputs.values._edges;
		expect(edges.length).toBe(2);
		expect(edges[0].annotations[annotatedVariadicIndex]).toBe(0);
		expect(edges[1].annotations[annotatedVariadicIndex]).toBe(1);
	});

	it('should fill placeholders with 0 if index is large', () => {
		const g = new Graph();
		const s1 = createSource(g, 5);
		const t = createTarget(g);

		// connect with index=3 => placeholders for 0,1,2
		g.connect(s1, s1.outputs.out, t, t.inputs.values, 3);
		// array => [0,0,0,5]
		expect(t.inputs.values.value).toEqual([0, 0, 0, 5]);
		// confirm edges
		const edges = t.inputs.values._edges;
		expect(edges.length).toBe(4);
		expect(edges[0].annotations[annotatedVariadicIndex]).toBe(0);
		expect(edges[1].annotations[annotatedVariadicIndex]).toBe(1);
		expect(edges[2].annotations[annotatedVariadicIndex]).toBe(2);
		expect(edges[3].annotations[annotatedVariadicIndex]).toBe(3);
	});

	it('should shift edges on middle insert', () => {
		const g = new Graph();
		const s1 = createSource(g, 1);
		const s2 = createSource(g, 2);
		const s3 = createSource(g, 3);
		const t = createTarget(g);

		// connect 0 => [1]
		g.connect(s1, s1.outputs.out, t, t.inputs.values, 0);
		// connect 1 => [1,2]
		g.connect(s2, s2.outputs.out, t, t.inputs.values, 1);

		// insert s3 at index=1 => we expect => [1,3,2]
		g.connect(s3, s3.outputs.out, t, t.inputs.values, 1);
		expect(t.inputs.values.value).toEqual([1, 3, 2]);

		const edges = t.inputs.values._edges;
		expect(edges.length).toBe(3);
		expect(edges[0].annotations[annotatedVariadicIndex]).toBe(0);
		expect(edges[1].annotations[annotatedVariadicIndex]).toBe(1);
		expect(edges[2].annotations[annotatedVariadicIndex]).toBe(2);
	});

	it('should remove correct index and shift the remainder', () => {
		const g = new Graph();
		const s1 = createSource(g, 1);
		const s2 = createSource(g, 2);
		const s3 = createSource(g, 3);
		const t = createTarget(g);

		// connect => [1], [1,2], [1,2,3]
		g.connect(s1, s1.outputs.out, t, t.inputs.values, 0);
		g.connect(s2, s2.outputs.out, t, t.inputs.values, 1);
		g.connect(s3, s3.outputs.out, t, t.inputs.values, 2);
		expect(t.inputs.values.value).toEqual([1, 2, 3]);

		// remove middle => remove index=1 => array => [1,3]
		const e2 = t.inputs.values._edges[1];
		expect(e2.annotations[annotatedVariadicIndex]).toBe(1);
		g.removeEdge(e2.id);
		expect(t.inputs.values.value).toEqual([1, 3]);

		// check edges
		const edges = t.inputs.values._edges;
		expect(edges.length).toBe(2);
		// e1 => index=0
		expect(edges[0].annotations[annotatedVariadicIndex]).toBe(0);
		// e3 => index=1 (shifted down from 2)
		expect(edges[1].annotations[annotatedVariadicIndex]).toBe(1);
	});
});
