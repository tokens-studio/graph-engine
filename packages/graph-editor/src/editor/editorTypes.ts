import { Menu } from '@/components/menubar/data';
import { DropPanelStore } from '@/components/panels/dropPanel/index.js';
import { CompactEdge, CompactNode } from '@/utils/compact';
import {
  ExternalLoadOptions,
  SerializedGraph,
} from '@tokens-studio/graph-engine';
import { Edge, Node, ReactFlowInstance } from 'reactflow';

export interface EditorProps {
  id: string;
  /**
   * Items to display in the drop panel.
   * Not populating this will result in the default items being displayed.
   */
  panelItems: DropPanelStore;
  /**
   * A lookup of the custom node types to display in the editor.
   * Not populating this will result in the default items being displayed.
   */
  nodeTypes?: Record<string, React.ReactElement>;
  emptyContent?: React.ReactNode;
  children?: React.ReactNode;
  onOutputChange?: (output: Record<string, unknown>) => void;
  externalLoader?: (opts: ExternalLoadOptions) => Promise<any> | any;
  /**
   * Whether or not to show the menu
   */
  showMenu?: boolean;

  menuItems?: Menu;
}

export type EditorState = {
  graph: SerializedGraph;
  nodes: CompactNode[];
  edges: CompactEdge[];
};

export type ImperativeEditorRef = {
  /**
   * Clears the editor of all nodes and edges
   * @returns
   */
  clear: () => void;
  save: () => EditorState;
  load: (state: EditorState) => void;
  getFlow: () => ReactFlowInstance;
};

export type EditorNode = Node;
export type EditorEdge = Edge;
