import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import Node from '../../../../src/nodes/typing/passUnit.js';

describe('typing/passUnit', () => {
	it('adds unit if falsey value', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('0');
		node.inputs.fallback.setValue('px');

		await node.execute();

		const output = node.outputs.value.value;
		expect(output).to.equal('0px');
	});

	it('adds unit if not detected', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('3');
		node.inputs.fallback.setValue('px');

		await node.execute();

		const output = node.outputs.value.value;
		expect(output).to.equal('3px');
	});

	it('does not add unit if  detected', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.value.setValue('3px');
		node.inputs.fallback.setValue('px');

		await node.execute();

		const output = node.outputs.value.value;
		expect(output).to.equal('3px');
	});
});
