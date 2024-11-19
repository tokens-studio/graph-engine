import { Graph } from '../../../../src/graph/graph.js';
import { ValueSnapMethod } from '../../../../src/types/index.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/math/snap.js';

describe('math/snap', () => {
	test('floors value to increment', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.value.setValue(17.3);
		node.inputs.increment.setValue(10);
		node.inputs.base.setValue(5);
		node.inputs.method.setValue(ValueSnapMethod.Floor);
		await node.execute();
		expect(node.outputs.snapped.value).to.equal(15);
	});

	test('rounds value to increment', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.value.setValue(17.3);
		node.inputs.increment.setValue(10);
		node.inputs.base.setValue(5);
		node.inputs.method.setValue(ValueSnapMethod.Round);
		await node.execute();
		expect(node.outputs.snapped.value).to.equal(15);
	});

	test('ceils value to increment', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.value.setValue(17.3);
		node.inputs.increment.setValue(10);
		node.inputs.base.setValue(5);
		node.inputs.method.setValue(ValueSnapMethod.Ceil);
		await node.execute();
		expect(node.outputs.snapped.value).to.equal(25);
	});

	test('rounds value with specific precision', async () => {
		const graph = new Graph();
		const node = new Node({ graph });
		node.inputs.value.setValue(1.46);
		node.inputs.increment.setValue(0.05);
		node.inputs.base.setValue(0);
		node.inputs.method.setValue(ValueSnapMethod.Round);
		await node.execute();
		expect(node.outputs.snapped.value).to.equal(1.45);
	});

});
