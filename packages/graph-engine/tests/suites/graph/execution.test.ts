import { Graph } from '../../../src/graph/graph.js';
import { Node, NumberSchema } from '../../../src/index.js';
import { describe, expect, test } from 'vitest';

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
});
