import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node, { CaseType } from '../../../../src/nodes/string/case.js';

describe('string/case', () => {
	test('should convert to camelCase', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello world test');
		node.inputs.type.setValue(CaseType.CAMEL);

		await node.execute();

		expect(node.outputs.string.value).toBe('helloWorldTest');
	});

	test('should convert to snake_case', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('Hello World Test');
		node.inputs.type.setValue(CaseType.SNAKE);

		await node.execute();

		expect(node.outputs.string.value).toBe('hello_world_test');
	});

	test('should convert to kebab-case', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('HelloWorld test');
		node.inputs.type.setValue(CaseType.KEBAB);

		await node.execute();

		expect(node.outputs.string.value).toBe('hello-world-test');
	});

	test('should convert to PascalCase', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello_world_test');
		node.inputs.type.setValue(CaseType.PASCAL);

		await node.execute();

		expect(node.outputs.string.value).toBe('HelloWorldTest');
	});

	test('should handle mixed input formats', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('some-mixed_FORMAT test');
		node.inputs.type.setValue(CaseType.CAMEL);

		await node.execute();

		expect(node.outputs.string.value).toBe('someMixedFormatTest');
	});
});
