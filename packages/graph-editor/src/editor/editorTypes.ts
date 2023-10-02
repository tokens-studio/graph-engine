import { PanelGroup } from '#/components/flow/DropPanel/PanelItems';
import { ExternalLoadOptions } from '@tokens-studio/graph-engine';
import { Edge, Node } from 'reactflow';

export type EditorProps = {
  id: string;
  name: string;
  /**
   * Items to display in the drop panel.
   * Not populating this will result in the default items being displayed.
   */
  panelItems?: PanelGroup[];
  /**
   * A lookup of the custom node types to display in the editor.
   * Not populating this will result in the default items being displayed.
   */
  nodeTypes?: Record<string, React.ReactElement>;
  /**
   * A lookup of the initial state of the custom nodes.
   * Not populating this will result in the default items being displayed.
   */
  stateInitializer?: Record<string, Record<string, unknown>>;
  onOutputChange: (output: Record<string, unknown>) => void;
  externalLoader?: (opts: ExternalLoadOptions) => Promise<any> | any;
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
