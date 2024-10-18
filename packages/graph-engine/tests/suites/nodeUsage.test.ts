import { Edge, Graph, nodeLookup } from '../../src/index.js';
import { StringSchema } from '../../src/schemas/index.js';
import { describe, expect, test } from 'vitest';
import InputNode from '../../src/nodes/generic/input.js';
import OutputNode from '../../src/nodes/generic/output.js';

describe('nodeUsage', () => {
	test('performs basic passthrough calculations', async () => {
		const graph = new Graph();

		const input = new InputNode({
			id: '780c1b1a-6931-4176-90c5-2efaef37d43a',
			graph
		});
		const output = new OutputNode({
			id: '442854d8-b1a2-4261-a310-8cf7cfaa25fd',
			graph
		});
		graph.addNode(input);
		graph.addNode(output);

		//Create an input port on the input
		input.addInput('foo', {
			type: StringSchema
		});

		output.addInput('input', {
			type: StringSchema
		});

		//Input is a special case with dynamic values so it needs to be executed and computed to generate the output values
		const res = await input.run();

		expect(res.error).to.be.null;

		const edge = input.outputs.foo.connect(output.inputs.input);

		const final = await graph.execute({
			inputs: {
				foo: {
					value: 'black'
				}
			}
		});

		expect(final.output).to.eql({
			input: {
				type: {
					$id: 'https://schemas.tokens.studio/string.json',
					title: 'String',
					type: 'string'
				},
				value: 'black'
			}
		});

		const serialized = graph.serialize();

		expect(serialized.annotations['engine.version']).to.equal('0.12.0');

		expect(serialized).to.have.property('edges');
		expect(serialized).to.have.property('nodes');

		expect(serialized.edges).to.eql([
			{
				id: (edge as Edge).id,
				source: '780c1b1a-6931-4176-90c5-2efaef37d43a',
				sourceHandle: 'foo',
				target: '442854d8-b1a2-4261-a310-8cf7cfaa25fd',
				targetHandle: 'input'
			}
		]);
		expect(serialized.nodes.length).to.equal(2);

		expect(serialized.nodes).to.eql([
			{
				id: '780c1b1a-6931-4176-90c5-2efaef37d43a',
				annotations: {
					'engine.dynamicInputs': true,
					'engine.singleton': true
				},
				inputs: [
					{
						name: 'foo',
						value: 'black',
						type: {
							$id: 'https://schemas.tokens.studio/string.json',
							title: 'String',
							type: 'string'
						}
					}
				],
				type: 'studio.tokens.generic.input'
			},
			{
				annotations: {
					'engine.dynamicInputs': true,
					'engine.singleton': true
				},
				id: '442854d8-b1a2-4261-a310-8cf7cfaa25fd',
				inputs: [
					{
						name: 'input',
						type: {
							$id: 'https://schemas.tokens.studio/string.json',
							title: 'String',
							type: 'string'
						},
						value: 'black'
					}
				],
				type: 'studio.tokens.generic.output'
			}
		]);

		const newGraph = await new Graph().deserialize(serialized, nodeLookup);
		const deserializedOutput = await newGraph.execute();

		expect(deserializedOutput.output).to.eql({
			input: {
				type: {
					$id: 'https://schemas.tokens.studio/string.json',
					title: 'String',
					type: 'string'
				},
				value: 'black'
			}
		});
	});
});
