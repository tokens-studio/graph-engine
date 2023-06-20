import { MinimizedFlowGraph, MinimizedNode } from "./types.js";
import { NodeTypes } from "../types.js";

export type Terminals = {
  input?: MinimizedNode;
  output?: MinimizedNode;
};

export const findTerminals = (graph: MinimizedFlowGraph): Terminals => {
  const terminals: Terminals = {
    input: undefined,
    output: undefined,
  };

  graph.nodes.forEach((node) => {
    switch (node.type) {
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
