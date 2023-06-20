import type { Edge, Node } from "reactflow";

export type FlowGraph = {
  nodes: Node[];
  edges: Edge[];
  state: Record<string, any>;
};

export type MinimizedNode = {
  id: string;
  type: string;
  data: any;
};

export type MinimizedEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
};

export type MinimizedFlowGraph = {
  nodes: MinimizedNode[];
  edges: MinimizedEdge[];
};
