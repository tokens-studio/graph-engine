import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node, { Position } from '@/nodes/string/pad.js';

describe('string/pad', () => {
	test('should pad start of string correctly', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.string.setValue('Hello');
		node.inputs.length.setValue(10);
		node.inputs.character.setValue('*');
		node.inputs.position.setValue(Position.START);

		await node.execute();

		expect(node.outputs.string.value).to.equal('*****Hello');
	});

	test('should pad end of string correctly', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.string.setValue('World');
		node.inputs.length.setValue(8);
		node.inputs.character.setValue('-');
		node.inputs.position.setValue(Position.END);

		await node.execute();

		expect(node.outputs.string.value).to.equal('World---');
	});

	test('should not pad if string length is already equal to or greater than specified length', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.string.setValue('LongString');
		node.inputs.length.setValue(5);
		node.inputs.character.setValue('0');
		node.inputs.position.setValue(Position.START);

		await node.execute();

		expect(node.outputs.string.value).to.equal('LongString');
	});

	test('should use default position (start) if not specified', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.string.setValue('Test');
		node.inputs.length.setValue(7);
		node.inputs.character.setValue('_');
		// Not setting position, should default to 'start'

		await node.execute();

		expect(node.outputs.string.value).to.equal('___Test');
	});

	test('should use first character if multiple characters are provided', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.string.setValue('ABC');
		node.inputs.length.setValue(6);
		node.inputs.character.setValue('XYZ');
		node.inputs.position.setValue(Position.END);

		await node.execute();

		expect(node.outputs.string.value).to.equal('ABCXXX');
	});
});
