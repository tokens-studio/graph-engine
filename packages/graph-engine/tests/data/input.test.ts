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

	test('connected input via .connect() should return source output value', () => {
		sourceOutput.connect(targetInput);

		expect(targetInput.value).toBe('source value');

		sourceOutput.set('new source value via connect');
		expect(targetInput.value).toBe('new source value via connect');
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

		graph.removeEdge('edge1');

		const sourceNode2 = new Node({
			id: 'source2',
			graph: graph,
			annotations: {}
		});
		sourceNode2.addOutput('out2', { type: AnySchema });
		const sourceOutput2 = sourceNode2.outputs.out2;
		sourceOutput2.set('source 2 value');
		graph.addNode(sourceNode2);

		graph.createEdge({
			id: 'edge2',
			source: 'source2',
			sourceHandle: 'out2',
			target: 'target',
			targetHandle: 'in'
		});

		expect(targetInput.value).toBe('source 2 value');
		expect(targetInput['_value']).toBe('forced value');
	});

	test('input value should revert to stored value after edge disconnection', () => {
		targetInput.setValue('initial target value');
		expect(targetInput.value).toBe('initial target value');

		graph.createEdge({
			id: 'edge_disconnect_test',
			source: 'source',
			sourceHandle: 'out',
			target: 'target',
			targetHandle: 'in'
		});

		expect(targetInput.value).toBe('source value');
		expect(targetInput['_value']).toBe('initial target value');

		graph.removeEdge('edge_disconnect_test');

		expect(targetInput.value).toBe('initial target value');
	});

	test('input value should be undefined after edge disconnection if no prior value existed', () => {
		expect(targetInput.value).toBe(undefined);

		graph.createEdge({
			id: 'edge_disconnect_test_no_prior',
			source: 'source',
			sourceHandle: 'out',
			target: 'target',
			targetHandle: 'in'
		});

		expect(targetInput.value).toBe('source value');
		expect(targetInput['_value']).toBe(undefined);

		graph.removeEdge('edge_disconnect_test_no_prior');

		expect(targetInput.value).toBe(undefined);
	});
});
