import { Node } from "../programmatic/node.js";
import { NodeTypes } from "../types.js";
import { Graph } from "./graph.js";

export type Terminals = {
  input?: Node;
  output?: Node;
};

export const findTerminals = (graph: Graph): Terminals => {
  const terminals: Terminals = {
    input: undefined,
    output: undefined,
  };

  Object.values(graph.nodes).forEach((node) => {
    switch (node.factory.type) {
      case NodeTypes.INPUT:
        terminals.input = node;
        break;
      case NodeTypes.OUTPUT:
        terminals.output = node;
        break;
    }
  });
  return terminals;
};
