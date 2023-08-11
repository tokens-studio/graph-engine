import { EditorEdge, EditorNode } from '@tokens-studio/graph-editor';

export interface ResolverData {
  nodes: EditorNode[];
  edges: EditorEdge[];
  state: Record<string, any>;
  code: string;
}
