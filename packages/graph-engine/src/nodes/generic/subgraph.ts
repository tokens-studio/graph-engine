import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node } from "@/programmatic/node.js";
import { AnySchema, StringSchema } from "@/schemas/index.js";
import InputNode from "./input.js";
import OutputNode from "./output.js";
import { IDeserializeOpts, SerializedGraph, SerializedNode } from "@/graph/types.js";
import { Graph } from "@/graph/graph.js";
import { autorun } from "mobx";

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
      visible: false,
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
    node._innerGraph = Graph.deserialize((opts.serialized as SerializedSubgraphNode).innergraph, opts.lookup);
    return node;
  }

  async execute() {
    const result = await this._innerGraph.execute();
    this.setOutput("value", result.output?.value, result.output?.type);
  }
}
