import { describe, expect, test } from 'vitest';
import { getDataFlowGraph } from '@tests/utils/index.js';
import Node from '@/nodes/typing/hasValue.js';

describe('typing/hasValue', () => {
	test('should return true for null value', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue(null);

		await node.execute();

		expect(node.outputs.undefined.value).to.be.true;
	});

	test('should return true for undefined value', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue(undefined);

		await node.execute();

		expect(node.outputs.undefined.value).to.be.true;
	});

	test('should return false for empty string', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue('');

		await node.execute();

		expect(node.outputs.undefined.value).to.be.false;
	});

	test('should return false for non-empty string', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue('Hello');

		await node.execute();

		expect(node.outputs.undefined.value).to.be.false;
	});

	test('should return false for number', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue(0);

		await node.execute();

		expect(node.outputs.undefined.value).to.be.false;
	});

	test('should return false for non-empty array', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue([1, 2, 3]);

		await node.execute();

		expect(node.outputs.undefined.value).to.be.false;
	});

	test('should return false for non-empty object', async () => {
		const graph = getDataFlowGraph();
		const node = new Node({ graph });

		node.inputs.value.setValue({ key: 'value' });

		await node.execute();

		expect(node.outputs.undefined.value).to.be.false;
	});
});
