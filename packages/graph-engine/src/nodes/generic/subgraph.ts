import { Graph } from '../../graph/graph.js';
import {
	IDeserializeOpts,
	SerializedGraph,
	SerializedNode
} from '../../graph/types.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import {
	annotatedDeleteable,
	hideFromParentSubgraph
} from '../../annotations/index.js';
import { autorun } from 'mobx';
import InputNode from './input.js';
import OutputNode from './output.js';

export interface SerializedSubgraphNode extends SerializedNode {
	innergraph: SerializedGraph;
}

export default class SubgraphNode extends Node {
	static title = 'Subgraph';
	static type = 'studio.tokens.generic.subgraph';
	static description = 'Allows you to run another subgraph internally';

	_innerGraph: Graph;

	constructor(props: INodeDefinition) {
		super(props);

		this._innerGraph = new Graph();

		//Pass capabilities down
		this._innerGraph.capabilities = this.getGraph().capabilities;

		const input = new InputNode({ graph: this._innerGraph });
		input.annotations[annotatedDeleteable] = false;
		const output = new OutputNode({ graph: this._innerGraph });
		output.annotations[annotatedDeleteable] = false;

		//Create the initial input and output nodes
		this._innerGraph.addNode(input);
		this._innerGraph.addNode(output);

		autorun(() => {
			//Get the existing inputs
			const existing = this.inputs;
			//Iterate through the inputs of the input node in the inner graph
			Object.entries(input.inputs).map(([key, value]) => {
				//If the key doesn't exist in the existing inputs, add it
				if (!existing[key] && !value.annotations[hideFromParentSubgraph]) {
					//Always add it as visible
					this.addInput(key, {
						type: value.type
					});
					this.inputs[key].setValue(value.value, {
						noPropagate: true
					});
				} else {
					//Note its possible that the input key still does not exist due to an annotation ,etc
					//Update the value
					this.inputs[key]?.setValue(value.value, {
						noPropagate: true
					});
				}
				//TODO handle deletions and mutations
			});
		});

		//Update when the outputs change
		autorun(() => {
			const existing = this.outputs;
			const existingPorts = Object.keys(existing);
			Object.entries(output.inputs).map(([key, value]) => {
				//If the key doesn't exist in the existing inputs, add it
				if (!existing[key] && !value.annotations[hideFromParentSubgraph]) {
					//Always add it as visible
					this.addOutput(key, {
						type: value.type
					});
					this.outputs[key].set(value.value, value.type);
				} else {
					//Note its possible that the input key still does not exist due to an annotation ,etc
					//Update the value
					this.outputs[key]?.set(value.value, value.type);
				}
			});

			//Remove any outputs that are no longer in the inner graph
			existingPorts.forEach(port => {
				if (!output.inputs[port]) {
					this.removeOutput(port);
				}
			});
		});
	}

	override serialize(): SerializedSubgraphNode {
		const serialized = super.serialize();
		return {
			...serialized,
			innergraph: this._innerGraph.serialize()
		};
	}

	static override deserialize(opts: IDeserializeOpts) {
		const node = super.deserialize(opts) as SubgraphNode;
		const innerGraph = new Graph();

		node._innerGraph = innerGraph.deserialize(
			(opts.serialized as SerializedSubgraphNode).innergraph,
			opts.lookup
		);
		return node;
	}

	async execute() {
		const inputs = Object.keys(this.inputs).reduce((acc, key) => {
			this.getRawInput(key);
			//Todo improve this for typing
			acc[key] = this.getRawInput(key);
			return acc;
		}, {});

		const result = await this._innerGraph.execute({
			inputs
		});

		Object.entries(result.output).forEach(([key, value]) => {
			this.setOutput(key, value.value, value.type);
		});
	}
}
