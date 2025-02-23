import { Graph } from '../../../src/graph/graph.js';
import { Node, NumberSchema } from '../../../src/index.js';
import { describe, expect, test } from 'vitest';
import Add from '../../../src/nodes/math/add.js';
import Output from '../../../src/nodes/generic/output.js';

class ExternalNode extends Node {
	constructor(props) {
		super(props);

		this.addOutput('foo', { type: NumberSchema });
	}

	async execute() {
		const val = await this.load('foo');
		this.outputs.foo.set(val);
	}
}

describe('Graph/execution', () => {
	test('throws an error when the external loader can be caught', async () => {
		const graph = new Graph();

		new ExternalNode({ id: 'a', graph });

		let thrown;
		try {
			await graph.execute();
		} catch (err) {
			thrown = err;
		} finally {
			expect(thrown).toBeDefined();
			expect(thrown.message).toEqual('No external loader specified');
		}
	});

	test('External loading works as expected', async () => {
		const graph = new Graph();

		graph.externalLoader = async () => {
			return 5;
		};

		new ExternalNode({ id: 'a', graph });

		await graph.execute();

		expect(graph.nodes.a.outputs.foo.value).toEqual(5);
	});

	test('works without an input node', async () => {
		const graph = new Graph();

		const a = new Add({ id: 'a', graph });
		const b = new Add({ id: 'b', graph });

		a.inputs.a.setValue(2);
		a.inputs.b.setValue(3);

		a.outputs.value.connect(b.inputs.a);
		b.inputs.b.setValue(5);

		const output = new Output({ id: 'c', graph });

		output.addInput('value', { type: NumberSchema });

		b.outputs.value.connect(output.inputs.value);

		graph.addNode(a);
		graph.addNode(b);
		graph.addNode(output);

		const result = await graph.execute();

		expect(result.output!.value.value).toEqual(10);
	});
});
