import { AnySchema } from '../../src/schemas/index.js';
import { Graph } from '../../src/graph/graph.js';
import { Input } from '../../src/programmatic/input.js';
import { Node } from '../../src/programmatic/node.js';
import { Output } from '../../src/programmatic/output.js';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Input', () => {
	let graph: Graph;
	let sourceNode: Node;
	let targetNode: Node;
	let sourceOutput: Output;
	let targetInput: Input;

	beforeEach(() => {
		graph = new Graph();

		sourceNode = new Node({
			id: 'source',
			graph: graph,
			annotations: {}
		});
		sourceNode.addOutput('out', {
			type: AnySchema
		});
		sourceOutput = sourceNode.outputs.out;
		sourceOutput.set('source value');
		graph.addNode(sourceNode);

		targetNode = new Node({
			id: 'target',
			graph: graph,
			annotations: {}
		});
		targetNode.addInput('in', {
			type: AnySchema
		});
		targetInput = targetNode.inputs.in;
		graph.addNode(targetNode);
	});

	test('connected input should return source output value', () => {
		graph.createEdge({
			id: 'edge1',
			source: 'source',
			sourceHandle: 'out',
			target: 'target',
			targetHandle: 'in'
		});

		expect(targetInput.value).toBe('source value');

		sourceOutput.set('new source value');
		expect(targetInput.value).toBe('new source value');
	});

	test('setValue should not store value for connected inputs', () => {
		graph.createEdge({
			id: 'edge1',
			source: 'source',
			sourceHandle: 'out',
			target: 'target',
			targetHandle: 'in'
		});

		targetInput.setValue('attempted override');

		expect(targetInput.value).toBe('source value');
		expect(targetInput['_value']).toBe(undefined);
	});

	test('setValue should store value for unconnected inputs', () => {
		targetInput.setValue('new unconnected value');

		expect(targetInput.value).toBe('new unconnected value');
		expect(targetInput['_value']).toBe('new unconnected value');
	});

	test('setValue with forceStore option should store value even for connected inputs', () => {
		graph.createEdge({
			id: 'edge1',
			source: 'source',
			sourceHandle: 'out',
			target: 'target',
			targetHandle: 'in'
		});

		targetInput.setValue('forced value', { forceStore: true });

		expect(targetInput.value).toBe('source value');
		expect(targetInput['_value']).toBe('forced value');
	});
});
