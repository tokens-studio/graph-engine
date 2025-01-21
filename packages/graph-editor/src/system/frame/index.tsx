import {
  CapabilityFactory,
  Graph,
  Node,
  NodeLoader,
} from '@tokens-studio/graph-engine';
import { Control } from '@/types/controls.js';
import { DefaultToolbarButtons } from '@/registry/toolbar.js';
import { DropPanelStore } from '@/components/index.js';
import { SystemSettings } from './settings.js';
import { defaultSpecifics } from '@/registry/specifics.js';
import { iconsFactory } from '@/registry/icon.js';
import { makeAutoObservable } from 'mobx';
import React from 'react';


export interface IFrame {
  /**
   * The underlying graph to use for the frame
   */
  graph :Graph;
  /**
   * Items to display in the drop panel.
   * Not populating this will result in the default items being displayed.
   */ 
  panelItems?: DropPanelStore;
  /**
   * Customize the controls that are displayed in the editor
   */
  controls?: Control[];
  /**
   * Additional specifics to display in the editor for custom types
   */
  specifics?: Record<
    string,
    React.FC<{
      node: Node;
    }>
  >;
  /**
   * The loader for nodes to display in the editor
   */
  nodeLoader: NodeLoader;

  /**
   * Capabilities to load into the graphs. Each factory is loaded into each graph individually.
   */
  capabilities?: CapabilityFactory[];
  /**
   * A lookup of the custom node ui types to display in the editor.
   */
  customNodeUI?: Record<string, React.ReactElement>;
  /**
   * An icon lookup to be used for legends, etc
   */
  icons?: Record<string, React.ReactNode>;

  settings?: SystemSettings;

  /**
   * Additional buttons to display in the toolbar
   */
  toolbarButtons?: React.ReactElement[];
}

export class Frame {
  specifics!: Record<
    string,
    React.FC<{
      node: Node;
    }>
  >;
  nodeLoader!: NodeLoader;
  graph!: Graph;
  panelItems!: DropPanelStore;
  capabilities!: CapabilityFactory[];
  customNodeUI!: Record<string, React.ReactElement>;
  controls!: Control[];
  settings!: SystemSettings;
  icons!: Record<string, React.ReactNode>;
  toolbarButtons!: React.ReactElement[];

  constructor(config: IFrame) {
    const defaultConfig: Partial<IFrame> = {
      specifics: defaultSpecifics,
      panelItems: new DropPanelStore([]),
      capabilities: [],
      customNodeUI: {},
      controls: [],
      icons: iconsFactory(),
      settings: new SystemSettings({}),
      toolbarButtons: DefaultToolbarButtons(),
    };

    Object.assign(this, defaultConfig, config);
    makeAutoObservable(this);
  }

  serialize() {
    return {
      graph: this.graph.serialize(),
    }
  }
}
