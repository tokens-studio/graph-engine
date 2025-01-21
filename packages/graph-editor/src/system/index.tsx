import {
  CapabilityFactory,
  Node,
  NodeLoader,
} from '@tokens-studio/graph-engine';
import { Control } from '@/types/controls.js';
import { DefaultToolbarButtons } from '@/registry/toolbar.js';
import { DropPanelStore } from '@/components/index.js';
import { SystemSettings } from './settings.js';
import { TabBase, TabData } from 'rc-dock';
import { defaultSpecifics } from '@/registry/specifics.js';
import { iconsFactory } from '@/registry/icon.js';
import { makeAutoObservable } from 'mobx';
import React from 'react';

export type TabLoader = (tab: TabBase) => TabData | undefined;

export interface ISystem {
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
   * The loader for tabs to display in the editor
   */
  tabLoader: TabLoader;
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

export class System {
  specifics!: Record<
    string,
    React.FC<{
      node: Node;
    }>
  >;
  nodeLoader!: NodeLoader;
  tabLoader!: TabLoader;
  panelItems!: DropPanelStore;
  capabilities!: CapabilityFactory[];
  customNodeUI!: Record<string, React.ReactElement>;
  controls!: Control[];
  settings!: SystemSettings;
  icons!: Record<string, React.ReactNode>;
  toolbarButtons!: React.ReactElement[];

  constructor(config: ISystem) {
    const defaultConfig: Partial<ISystem> = {
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
}
