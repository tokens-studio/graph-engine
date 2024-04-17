import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node } from "@/programmatic/node.js";
import { AnySchema, StringSchema } from "@/schemas/index.js";
import InputNode from "./input.js";
import OutputNode from "./output.js";
import { IDeserializeOpts, SerializedGraph, SerializedNode } from "@/graph/types.js";
import { Graph } from "@/graph/graph.js";
import { autorun } from "mobx";
import { hideFromParentSubgraph } from "@/annotations/index.js";

export interface SerializedSubgraphNode extends SerializedNode {
  innergraph: SerializedGraph;
}


export default class SubgraphNode extends Node {
  static title = "Subgraph";
  static type = NodeTypes.SUBGRAPH;
  static description = "Allows you to run another subgraph internally";

  _innerGraph: Graph;
  constructor(props: INodeDefinition) {
    super(props);

    this._innerGraph = new Graph();

    //Pass capabilities down
    this._innerGraph.capabilities = this.getGraph().capabilities;

    const input = new InputNode({ graph: this._innerGraph });
    input.annotations['engine.deletable'] = false;
    const output = new OutputNode({ graph: this._innerGraph });
    output.annotations['engine.deletable'] = false;

    //Create the initial input and output nodes
    this._innerGraph.addNode(input);
    this._innerGraph.addNode(output);


    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });

    autorun(() => {

      //Get the existing inputs 
      const existing = this.inputs;

      //Iterate through the inputs of the input node in the inner graph
      Object.entries(input.inputs).map(([key, value]) => {

        //If the key doesn't exist in the existing inputs, add it
        if (!existing[key] && !value.annotations[hideFromParentSubgraph]) {
          //Always add it as visible
          this.addInput(key, {
            type: value.type,
            visible: true,
          });
          this.inputs[key].setValue(value.value, {
            noPropagate: true
          });
        } else {
          //Update the value 
          this.inputs[key].setValue(value.value, {
            noPropagate: true
          });
        }
        //TODO handle deletions and mutations
      });

      //Handle updates from the inner graph
      this.setOutput("value", output.outputs.value.value, output.outputs.value.type);
    });
  }

  override serialize(): SerializedSubgraphNode {
    const serialized = super.serialize();
    return {
      ...serialized,
      innergraph: this._innerGraph.serialize(),
    };
  }

  static override deserialize(opts: IDeserializeOpts) {
    const node = super.deserialize(opts) as SubgraphNode;
    const innerGraph = new Graph();

    node._innerGraph = innerGraph.deserialize((opts.serialized as SerializedSubgraphNode).innergraph, opts.lookup);
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

    this.setOutput("value", result.output?.value, result.output?.type);
  }
}
