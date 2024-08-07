import {
  CapabilityFactory,
  Node as GraphNode,
  SchemaObject,
  SerializedGraph,
} from '@tokens-studio/graph-engine';

import { Edge, Node, ReactFlowInstance } from 'reactflow';
import { FullyFeaturedGraph } from '@/types/index.js';
import { LayoutBase } from 'rc-dock';
import { Menu } from '@/components/menubar/data.js';
import { System } from '@/system/index.js';
import type { LayoutBase } from 'rc-dock';

export interface EditorProps {
  id?: string;

  /**
   * The system to use for the editor
   */
  system: System;
  /**
   * A lookup of the custom node types to display in the editor.
   * Not populating this will result in the default items being displayed.
   *
   * This replaces all of the node types, so you will be responsible for loading them all
   */
  nodeTypes?: Record<string, typeof GraphNode>;

  /**
   * Content to display in a graph editor when there are no nodes
   */
  emptyContent?: React.ReactNode;
  children?: React.ReactNode;
  onOutputChange?: (output: Record<string, unknown>) => void;
  /**
   * Whether or not to show the menu
   */
  showMenu?: boolean;

  /**
   * A custom menu to display in the editor.
   */
  menuItems?: Menu;
  /**
   * An initial layout to use
   */
  initialLayout?: LayoutBase;

  /**
   * Schemas to expose to the editor
   */
  schemas?: SchemaObject[];

  /**
   * Additional colors to display in the editor for custom types
   */
  typeColors?: Record<string, { color: string; backgroundColor: string }>;

}

export interface GraphEditorProps {
  id: string;
  emptyContent?: React.ReactNode;
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
  children?: React.ReactNode;
}

export type ImperativeEditorRef = {
  /**
   * Clears the editor of all nodes and edges
   * @returns
   */
  clear: () => void;
  save: () => SerializedGraph;
  load: (state: FullyFeaturedGraph) => void;
  loadRaw: (state: SerializedGraph) => void;
  getFlow: () => ReactFlowInstance;
  getGraph: () => FullyFeaturedGraph;
};

export type EditorNode = Node;
export type EditorEdge = Edge;
