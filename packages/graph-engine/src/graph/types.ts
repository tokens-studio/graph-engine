import { TypeDefinition } from "..";

export interface SerializedInput {
  name: string;
  value: any;
  type: TypeDefinition;
}

export interface SerializedNode {
  id: string;
  type: string;
  inputs: SerializedInput[];
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface SerializedGraphOptions {
  description: string;
}

export interface SerializedGraph {
  version: string;
  graph: SerializedGraphOptions;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
}
