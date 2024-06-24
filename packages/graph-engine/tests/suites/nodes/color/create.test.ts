import { Graph } from '../../../../src/graph/graph.js';
import Node from '../../../../src/nodes/color/create.js';

describe('color/create', () => {
	it('creates the expected color with rgb', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.space.setValue('rgb');
		node.inputs.a.setValue(255);
		node.inputs.b.setValue(255);
		node.inputs.c.setValue(255);

		await node.execute();
		const output = node.outputs.value.value;

		expect(output).toStrictEqual('#ffffffff');
	});
	it('creates the expected color with rgba', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.space.setValue('rgb');
		node.inputs.a.setValue(255);
		node.inputs.b.setValue(255);
		node.inputs.c.setValue(255);
		node.inputs.d.setValue(0.5);

		await node.execute();
		const output = node.outputs.value.value;
		expect(output).toStrictEqual('#ffffff80');
	});

	it('creates the expected color with hsl', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.space.setValue('hsl');
		node.inputs.a.setValue(0);
		node.inputs.b.setValue(1);
		node.inputs.c.setValue(0.5);

		await node.execute();
		const output = node.outputs.value.value;

		expect(output).toStrictEqual('#ff0000ff');
	});

	it('creates the expected color with hsv', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.space.setValue('hsv');
		node.inputs.a.setValue(88);
		node.inputs.b.setValue(100);
		node.inputs.c.setValue(0.9);
		node.inputs.d.setValue(0.5);

		await node.execute();
		const output = node.outputs.value.value;

		expect(output).toStrictEqual('#00e60080');
	});
});
