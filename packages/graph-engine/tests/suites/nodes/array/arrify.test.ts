import { AnySchema, StringSchema } from '../../../../src/index.js';
import { Graph } from '../../../../src/graph/graph.js';
import { arrayOf } from '../../../../src/schemas/utils.js';
import { describe, expect, test } from 'vitest';
import ConstantSourceNode from '../../../../src/nodes/generic/constant.js';
import Node from '../../../../src/nodes/array/arrify.js';

describe('array/arrify', () => {
	test('exports an array by default', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.eql([]);
		expect(node.outputs.value.type).to.contains(arrayOf(AnySchema));
	});
	test('produces the expected array', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		const constantA = new ConstantSourceNode({ graph });
		constantA.inputs.value.setValue('hello', {
			type: StringSchema
		});

		const constantB = new ConstantSourceNode({ graph });
		constantB.inputs.value.setValue('world', {
			type: StringSchema
		});

		constantA.outputs.value.connect(node.inputs.items);
		constantB.outputs.value.connect(node.inputs.items);

		await node.execute();

		const actual = node.outputs.value.value;

		expect(actual).to.eql(['hello', 'world']);
		expect(node.outputs.value.type).to.contains(arrayOf(StringSchema));
	});
});
