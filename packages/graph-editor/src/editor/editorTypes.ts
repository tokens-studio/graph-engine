import { Menu } from '@/components/menubar/data';
import { DropPanelStore } from '@/components/panels/dropPanel/index.js';
import {
  ExternalLoadOptions,
  SerializedGraph,
  Node as GraphNode,
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
   * A lookup of the custom node uiS types to display in the editor.
   */
  customNodeUI?: Record<string, React.ReactElement>;
  /**
   * A lookup of the custom node types to display in the editor.
   * Not populating this will result in the default items being displayed.
   * 
   * This replaces all of the node types, so you will be responsible for loading them all
   */
  nodeTypes?: Record<string, typeof GraphNode>;

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

export interface GraphEditorProps {
  id: string;
  emptyContent?: React.ReactNode;
  /**
 * A lookup of the custom node uiS types to display in the editor.
 */
  customNodeUI?:  Record<string, React.ReactElement>;
  /**
   * A lookup of the custom node types to display in the editor.
   * Not populating this will result in the default items being displayed.
   * 
   * This replaces all of the node types, so you will be responsible for loading them all
   */
  nodeTypes?: Record<string, typeof GraphNode>;
  children?: React.ReactNode;
}



export type ImperativeEditorRef = {
  /**
   * Clears the editor of all nodes and edges
   * @returns
   */
  clear: () => void;
  save: () => SerializedGraph;
  load: (state: SerializedGraph) => void;
  getFlow: () => ReactFlowInstance;
};

export type EditorNode = Node;
export type EditorEdge = Edge;
