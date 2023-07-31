import { Edge, Node } from 'reactflow';

export interface InitialSet {
  urn: string;
  parentNode: string;
  name: string;
}

export type EditorProps = {
  id: string;
  name: string;
  onOutputChange: (output: Record<string, unknown>) => void;
};

export type EditorState = {
  nodes: Node[];
  edges: Edge[];
  nodeState: Record<string, unknown>;
};

export type ImperativeEditorRef = {
  /**
   * Clears the editor of all nodes and edges
   * @returns
   */
  clear: () => void;
  save: () => EditorState;
  forceUpdate: () => void;
  load: (state: EditorState) => void;
};

export type EditorNode = Node;
export type EditorEdge = Edge;
