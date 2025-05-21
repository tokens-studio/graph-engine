import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, it, vi } from 'vitest';
import ArraySubgraph from '../../../../src/nodes/array/arraySubgraph.js';
import InputNode from '../../../../src/nodes/generic/input.js';
import OutputNode from '../../../../src/nodes/generic/output.js';
import { Node, INodeDefinition } from '../../../../src/programmatic/node.js';
import {
	NumberSchema,
	ArraySchema
} from '../../../../src/schemas/index.js';

// Helper Node for testing inner graph changes
class InnerMultiplierNode extends Node {
	static override readonly type = 'test.inner.multiplier';
	static override readonly title = 'Inner Multiplier';

	factor: number;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', { type: NumberSchema, value: 0 });
		this.addOutput('result', { type: NumberSchema, value: 0 });
		this.factor = 1; // Default factor
	}

	override async execute() {
		const val = this.inputs.value.value as number;
		this.outputs.result.setValue(val * this.factor);
	}
}

describe('ArraySubgraph', () => {
	it('should pass the parent externalLoader to the inner graph', async () => {
		const graph = new Graph();

		// Create a mock external loader
		const mockExternalLoader = vi.fn(async () => {
			return 'external value';
		});

		// Set it on the parent graph
		graph.externalLoader = mockExternalLoader;

		// Create an ArraySubgraph node (which should inherit the loader)
		const arraySubgraphNode = new ArraySubgraph({ graph });

		// Ensure the _innerGraph now has the same externalLoader
		expect(arraySubgraphNode._innerGraph.externalLoader).toBe(
			mockExternalLoader
		);
	});

	it('should re-execute and propagate changes when a node within its inner graph changes', async () => {
		// Parent Graph Setup
		const parentGraph = new Graph();
		const arrayMapNode = new ArraySubgraph({ graph: parentGraph });

		const parentNodeInput = new InputNode({ graph: parentGraph });
		parentNodeInput.outputs.output.setValue([10, 20, 30], ArraySchema(NumberSchema));
		parentGraph.connect(
			parentNodeInput,
			parentNodeInput.outputs.output,
			arrayMapNode,
			arrayMapNode.inputs.array
		);

		const parentOutputNode = new OutputNode({ graph: parentGraph });
		parentGraph.connect(
			arrayMapNode,
			arrayMapNode.outputs.value,
			parentOutputNode,
			parentOutputNode.inputs.value
		);

		// Inner Graph Setup
		const innerGraphInputNode = Object.values(
			arrayMapNode._innerGraph.nodes
		).find(n => n.factory.type === InputNode.type) as InputNode;
		const innerGraphOutputNode = Object.values(
			arrayMapNode._innerGraph.nodes
		).find(n => n.factory.type === OutputNode.type) as OutputNode;

		if (!innerGraphInputNode || !innerGraphOutputNode) {
			throw new Error(
				'Could not find default input/output nodes in inner graph'
			);
		}

		const multiplier = new InnerMultiplierNode({
			graph: arrayMapNode._innerGraph
		});
		arrayMapNode._innerGraph.addNode(multiplier); // Make sure it's added

		arrayMapNode._innerGraph.connect(
			innerGraphInputNode,
			innerGraphInputNode.outputs.value, // This is the one that provides individual array item
			multiplier,
			multiplier.inputs.value
		);
		arrayMapNode._innerGraph.connect(
			multiplier,
			multiplier.outputs.result,
			innerGraphOutputNode,
			innerGraphOutputNode.inputs.value // This is the input of the OutputNode that collects results
		);

		// Initial Execution and Assertion
		multiplier.factor = 2;
		await parentGraph.execute();
		expect(parentOutputNode.inputs.value.value).toEqual([20, 40, 60]);

		// Change Internal Parameter and Assert Reactive Update
		multiplier.factor = 3;
		// Explicitly update the multiplier node in the inner graph.
		// This will cause its output to change.
		await arrayMapNode._innerGraph.update(multiplier.id);

		// The autorun in ArraySubgraph should detect the change in innerGraphOutputNode's input
		// (because multiplier's output changed and is connected to it),
		// and then schedule an update for arrayMapNode on the parentGraph.

		// Await MobX reactions to complete.
		await new Promise(resolve => setTimeout(resolve, 0));

		// The parentGraph should have re-executed arrayMapNode due to the update.
		// We check the output value directly.
		expect(parentOutputNode.inputs.value.value).toEqual([30, 60, 90]);
	});
});
