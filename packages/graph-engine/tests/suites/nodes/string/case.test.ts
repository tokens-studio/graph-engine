import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node, { CaseType } from '../../../../src/nodes/string/case.js';

describe('string/case', () => {
	test('should convert to camelCase with default delimiters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello-world.test_case');
		node.inputs.type.setValue(CaseType.CAMEL);
		node.inputs.delimiters.setValue('-_.');

		await node.execute();

		expect(node.outputs.string.value).toBe('helloWorldTestCase');
	});

	test('should convert to snake_case with custom delimiters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('Hello@World#Test');
		node.inputs.type.setValue(CaseType.SNAKE);
		node.inputs.delimiters.setValue('@#');

		await node.execute();

		expect(node.outputs.string.value).toBe('hello_world_test');
	});

	test('should convert to kebab-case with single delimiter', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('HelloWorld+test');
		node.inputs.type.setValue(CaseType.KEBAB);
		node.inputs.delimiters.setValue('+');

		await node.execute();

		expect(node.outputs.string.value).toBe('hello-world-test');
	});

	test('should convert to PascalCase with multiple custom delimiters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello|world$test%case');
		node.inputs.type.setValue(CaseType.PASCAL);
		node.inputs.delimiters.setValue('|$%');

		await node.execute();

		expect(node.outputs.string.value).toBe('HelloWorldTestCase');
	});
	test('should handle empty delimiters string', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello-world_test');
		node.inputs.type.setValue(CaseType.CAMEL);
		node.inputs.delimiters.setValue('');

		await node.execute();

		// Should only split on spaces and handle camelCase conversion
		expect(node.outputs.string.value).toBe('hello-world_test');
	});
	test('should handle multiple occurrences of delimiters', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.string.setValue('hello--world..test__case.test-hello_world');
		node.inputs.type.setValue(CaseType.CAMEL);
		node.inputs.delimiters.setValue('-_.');

		await node.execute();

		expect(node.outputs.string.value).toBe('helloWorldTestCaseTestHelloWorld');
	});
});
