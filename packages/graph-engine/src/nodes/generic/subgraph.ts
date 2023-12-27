import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node, NodeFactory } from "@/programmatic/node.js";
import { AnySchema, StringSchema } from "@/schemas/index.js";
import InputNode from "./input.js";
import OutputNode from "./output.js";
import { SerializedGraph, SerializedNode } from "@/graph/types.js";
import { Graph } from "@/graph/graph.js";

export interface SerializedSubgraphNode extends SerializedNode {
  graph: SerializedGraph;
}

export interface ISubgraphNodeDefinition extends INodeDefinition {
  graph: Graph;
}

export default class SubgraphNode extends Node {
  static title = "Subgraph";
  static type = NodeTypes.SUBGRAPH;
  static description = "Allows you to run another subgraph internally";

  _innerGraph: Graph;
  constructor(props?: ISubgraphNodeDefinition) {
    super(props);

    this._innerGraph = props?.graph || new Graph();

    this._innerGraph.addNode(new InputNode());
    this._innerGraph.addNode(new OutputNode());

    this.addOutput("value", {
      type: AnySchema,
      visible: false,
    });

    //No inputs initiallly
  }

  override serialize(): SerializedSubgraphNode {
    const serialized = super.serialize();
    return {
      ...serialized,
      graph: this._innerGraph.serialize(),
    };
  }

  static override deserialize(
    serialized: SerializedSubgraphNode,
    lookup: Record<string, NodeFactory>
  ) {
    const node = super.deserialize(serialized, lookup) as SubgraphNode;
    node._innerGraph = Graph.deserialize(serialized.graph, lookup);
    return node;
  }

  async execute() {
    const result = await this._innerGraph.execute();
    this.setOutput("value", result.output?.value, result.output?.type);
  }
}
