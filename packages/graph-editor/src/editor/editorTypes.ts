import { Edge, Node, ReactFlowInstance } from 'reactflow';

export type EditorProps = {
  id: string;
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
  getFlow: () => ReactFlowInstance;
};

export type EditorNode = Node;
export type EditorEdge = Edge;
