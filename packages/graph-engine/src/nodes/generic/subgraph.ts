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
export interface ISubgraphNode extends INodeDefinition {
	innergraph?: Graph;
}

export default class SubgraphNode extends Node {
	static title = 'Subgraph';
	static type = 'studio.tokens.generic.subgraph';
	static description = 'Allows you to run another subgraph internally';

	_innerGraph: Graph;

	constructor(props: ISubgraphNode) {
		super(props);

		const existing = !!props.innergraph;
		this._innerGraph = props.innergraph || new Graph();

		// Automatically propagate the parent’s loader, if any
		if (props.graph?.externalLoader) {
			this._innerGraph.externalLoader = props.graph.externalLoader;
		}

		//Pass capabilities down
		this._innerGraph.capabilities = this.getGraph().capabilities;

		let input: InputNode | undefined = undefined;
		let output: OutputNode | undefined = undefined;

		if (!existing) {
			input = new InputNode({ graph: this._innerGraph });
			input.annotations[annotatedDeleteable] = false;
			output = new OutputNode({ graph: this._innerGraph });
			output.annotations[annotatedDeleteable] = false;

			//Create the initial input and output nodes
			this._innerGraph.addNode(input);
			this._innerGraph.addNode(output);
		} else {
			Object.values(this._innerGraph.nodes).forEach(node => {
				if (node.factory.type == InputNode.type) {
					input = node as InputNode;
				}
				if (node.factory.type == OutputNode.type) {
					output = node as OutputNode;
				}
			});
		}

		if (!input) throw new Error('No input node found');
		if (!output) throw new Error('No output node found');

		autorun(() => {
			//Get the existing inputs
			const existing = this.inputs;
			//Iterate through the inputs of the input node in the inner graph
			Object.entries(input!.inputs).map(([key, value]) => {
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
			Object.entries(output!.inputs).map(([key, value]) => {
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
				if (!output!.inputs[port]) {
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

	static override async deserialize(opts: IDeserializeOpts) {
		const innergraph = await new Graph().deserialize(
			(opts.serialized as SerializedSubgraphNode).innergraph,
			opts.lookup
		);

		const node = (await super.deserialize({
			...opts,
			//@ts-expect-error
			innergraph
		})) as SubgraphNode;

		return node;
	}

	async execute() {
		const inputs = Object.keys(this.inputs).reduce((acc, key) => {
			this.inputs[key];
			//Todo improve this for typing
			acc[key] = this.inputs[key];
			return acc;
		}, {});

		const result = await this._innerGraph.execute({
			inputs
		});

		Object.entries(result.output || {}).forEach(([key, value]) => {
			this.outputs[key].set(value.value, value.type);
		});
	}
}
