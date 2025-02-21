import { Graph, StringSchema, nodeLookup } from '@tokens-studio/graph-engine';
import { describe, expect, test } from 'vitest';
import CreateReferenceNode from '../src/nodes/createReference.js';

const ConstantNode = nodeLookup['studio.tokens.generic.constant'];

describe('naming/createReference', () => {
	test('exports an empty string by default', async () => {
		const graph = new Graph();
		const node = new CreateReferenceNode({ graph });

		await node.execute();

		const actual = node.outputs.reference.value;

		expect(actual).toBe('');
		expect(node.outputs.reference.type).toBe(StringSchema);
	});

	test('creates a reference from multiple segments', async () => {
		const graph = new Graph();
		const node = new CreateReferenceNode({ graph });

		const segment1 = new ConstantNode({ graph });
		segment1.inputs.value.setValue('colors', {
			type: StringSchema
		});

		const segment2 = new ConstantNode({ graph });
		segment2.inputs.value.setValue('primary', {
			type: StringSchema
		});

		const segment3 = new ConstantNode({ graph });
		segment3.inputs.value.setValue('500', {
			type: StringSchema
		});

		segment1.outputs.value.connect(node.inputs.segments);
		segment2.outputs.value.connect(node.inputs.segments);
		segment3.outputs.value.connect(node.inputs.segments);

		await node.execute();

		const actual = node.outputs.reference.value;

		expect(actual).toBe('{colors.primary.500}');
	});

	test('handles single segment reference', async () => {
		const graph = new Graph();
		const node = new CreateReferenceNode({ graph });

		const segment = new ConstantNode({ graph });
		segment.inputs.value.setValue('colors', {
			type: StringSchema
		});

		segment.outputs.value.connect(node.inputs.segments);

		await node.execute();

		expect(node.outputs.reference.value).toBe('{colors}');
	});
});
