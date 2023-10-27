import { FlowGraph } from "@tokens-studio/graph-engine";

export const upgrade = async (graph: FlowGraph) => {
  //Version might not exist
  //@ts-ignore
  if (!graph.version) {
    //@ts-ignore
    graph.version = "0.12.0";
  }
  return graph;
};
