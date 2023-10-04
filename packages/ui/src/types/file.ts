import { Edge, Node } from 'reactflow';
import { EditorEdge, EditorNode } from '@tokens-studio/graph-editor';
export type GraphFile = {
  nodes: Node[];
  edges: Edge[];
  state: {
    //The stored state of each node as a key-value pair using the node id
    [key in string]: any;
  };
  code: string;
  //The name of the graph. This is used to handle scoping correctly in previews
  name?: string;
};

export interface ResolverData {
  nodes: EditorNode[];
  edges: EditorEdge[];
  state: Record<string, any>;
  code: string;
}
