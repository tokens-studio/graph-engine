import { AnySchema, ToInput } from '../../../../src/index.js';
import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/logic/switch.js';

describe('logic/switch', () => {
	test('outputs the value of the matching input', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.addInput('foo', { type: AnySchema });
		node.addInput('bar', { type: AnySchema });
		node.addInput('default', { type: AnySchema });

		const inputs = node.inputs as ToInput<{
			foo: any;
			bar: any;
			default: any;
			condition: string;
		}>;

		inputs.foo.setValue('fooValue');
		inputs.bar.setValue('barValue');
		inputs.default.setValue('defaultValue');
		inputs.condition.setValue('foo');

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe('fooValue');
	});

	test('outputs the default value when no condition matches', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.addInput('foo', { type: AnySchema });
		node.addInput('bar', { type: AnySchema });
		node.addInput('default', { type: AnySchema });

		const inputs = node.inputs as ToInput<{
			foo: any;
			bar: any;
			default: any;
			condition: string;
		}>;

		inputs.foo.setValue('fooValue');
		inputs.bar.setValue('barValue');
		inputs.default.setValue('defaultValue');
		inputs.condition.setValue('baz');

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe('defaultValue');
	});

	test('outputs undefined when no inputs and no default value', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.condition.setValue('foo');

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBeUndefined();
	});

	test('outputs the value of the matching input with dynamic inputs', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.addInput('dynamic1', { type: AnySchema });
		node.addInput('dynamic2', { type: AnySchema });
		node.addInput('default', { type: AnySchema });

		const inputs = node.inputs as ToInput<{
			dynamic1: any;
			dynamic2: any;
			default: any;
			condition: string;
		}>;

		inputs.dynamic1.setValue('dynamic1Value');
		inputs.dynamic2.setValue('dynamic2Value');
		inputs.default.setValue('defaultValue');
		inputs.condition.setValue('dynamic2');

		await node.execute();

		const result = node.outputs.value.value;
		expect(result).toBe('dynamic2Value');
	});
});
