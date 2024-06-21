import { Graph } from "./graph.js";
import { Node } from "../programmatic/node.js";

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
      case "studio.tokens.generic.input":
        terminals.input = node;
        break;
      case "studio.tokens.generic.output":
        terminals.output = node;
        break;
    }
  });
  return terminals;
};
