import * as basic from "./data/processed/basic.json";
import { MinimizedFlowGraph, execute } from "../src/core.js";
import { nodes } from "../src/nodes/index.js";

const process = async () => {
  const result = await execute({
    graph: basic as unknown as MinimizedFlowGraph,
    inputValues: {},
    nodes,
  });
  console.log("processing finished ", result);
};

process();
