import { annotatedVersion } from '@tokens-studio/graph-engine';
import { describe, expect, it } from 'vitest';
import { removeRedundantInputValues } from './removeRedundantInputValues';

describe('removeRedundantInputValues', () => {
	it('should remove input values for connected ports', async () => {
		const graph = {
			annotations: {},
			nodes: {
				node1: {
					inputs: {
						input1: {
							_value: 'value1',
							_edges: [],
							variadic: false
						},
						input2: {
							_value: 'value2',
							_edges: ['edge1'],
							variadic: false
						},
						input3: {
							_value: 'value3',
							_edges: ['edge2'],
							variadic: true // variadic inputs should keep their values
						}
					},
					serialized: {
						inputs: [
							{ name: 'input1', value: 'value1' },
							{ name: 'input2', value: 'value2' },
							{ name: 'input3', value: 'value3' }
						]
					}
				}
			}
		};

		const result = await removeRedundantInputValues(graph);

		expect(result.annotations[annotatedVersion]).toBe('0.9.11');

		expect(result.nodes.node1.inputs.input1._value).toBe('value1');
		expect(result.nodes.node1.inputs.input2._value).toBeUndefined();
		expect(result.nodes.node1.inputs.input3._value).toBe('value3');

		expect(result.nodes.node1.serialized.inputs[0].value).toBe('value1');
		expect('value' in result.nodes.node1.serialized.inputs[1]).toBe(false); // value deleted
		expect(result.nodes.node1.serialized.inputs[2].value).toBe('value3');
	});

	it('should remove value for connected, non-variadic dynamically created inputs', async () => {
		// simulate an input that might be created dynamically (like a subgraph input)
		// and ensure its value is removed correctly if it's connected and non-variadic
		const graph = {
			annotations: {},
			nodes: {
				dynamicNode: {
					inputs: {
						dynamicInput: {
							_value: 'dynamicValue',
							_edges: ['someEdgeId'], // mark as connected
							variadic: false
						}
					},
					serialized: {
						inputs: [{ name: 'dynamicInput', value: 'dynamicValue' }]
					}
				}
			}
		};

		const result = await removeRedundantInputValues(graph);

		expect(result.nodes.dynamicNode.inputs.dynamicInput._value).toBeUndefined();
		expect('value' in result.nodes.dynamicNode.serialized.inputs[0]).toBe(
			false
		);
	});

	it('should keep value for connected, variadic dynamically created inputs', async () => {
		const graph = {
			annotations: {},
			nodes: {
				dynamicVariadicNode: {
					inputs: {
						dynamicVarInput: {
							_value: ['dynamicValue1', 'dynamicValue2'],
							_edges: ['someEdgeId'], // mark as connected
							variadic: true
						}
					},
					serialized: {
						inputs: [
							{
								name: 'dynamicVarInput',
								value: ['dynamicValue1', 'dynamicValue2']
							}
						]
					}
				}
			}
		};

		const result = await removeRedundantInputValues(graph);

		expect(
			result.nodes.dynamicVariadicNode.inputs.dynamicVarInput._value
		).toEqual(['dynamicValue1', 'dynamicValue2']);
		expect(result.nodes.dynamicVariadicNode.serialized.inputs[0].value).toEqual(
			['dynamicValue1', 'dynamicValue2']
		);
	});

	it('should handle null or undefined nodes and inputs', async () => {
		const graph = {
			annotations: {},
			nodes: {
				node1: {
					// no inputs defined
				},
				node2: null
			}
		};

		const result = await removeRedundantInputValues(graph);
		expect(result.annotations[annotatedVersion]).toBe('0.9.11');
	});

	it('should handle graph with no nodes', async () => {
		// mock graph with no nodes
		const graph = {
			annotations: {}
		};

		const result = await removeRedundantInputValues(graph);
		expect(result.annotations[annotatedVersion]).toBe('0.9.11');
	});
});
