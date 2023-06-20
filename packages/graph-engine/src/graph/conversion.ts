import { FlowGraph, MinimizedFlowGraph } from "./types.js";
import { Graph } from "./graph.js";

export const convertFlowGraphToGraphlib = (
  graph: FlowGraph | MinimizedFlowGraph
): Graph => {
  const g = new Graph();
  graph.nodes.forEach((node) => g.setNode(node.id, node.type));
  graph.edges.forEach((edge) =>
    g.setEdge(
      edge.id,
      edge.source,
      edge.target,
      edge.sourceHandle,
      edge.targetHandle
    )
  );
  return g;
};
