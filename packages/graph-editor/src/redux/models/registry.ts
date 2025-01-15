import {
  AllSchemas,
  CapabilityFactory,
  Node,
  NodeLoader,
  SchemaObject,
} from '@tokens-studio/graph-engine';
import { Control } from '@/types/controls.js';
import { DefaultToolbarButtons } from '@/registry/toolbar.js';
import {
  DropPanelStore,
  defaultPanelGroupsFactory,
} from '@/components/panels/dropPanel/index.js';
import { ReactElement } from 'react';
import { RootModel } from './root.js';
import { createModel } from '@rematch/core';
import { defaultControls } from '@/registry/control.js';
import { defaultSpecifics } from '@/registry/specifics.js';
import { icons } from '@/registry/icon.js';
import { inputControls } from '@/registry/inputControls.js';

export interface RegistryState {
  //Additional specific controls for nodes. Appended to the end of the default controls
  nodeSpecifics: Record<string, React.FC<{ node: Node }>>;
  icons: Record<string, React.ReactNode>;
  inputControls: Record<string, React.FC<{ node: Node }>>;
  controls: Control[];
  nodeTypes: NodeLoader;
  panelItems: DropPanelStore;
  capabilities: CapabilityFactory[];
  toolbarButtons: ReactElement[];
  schemas: SchemaObject[];
}

export const registryState = createModel<RootModel>()({
  state: {
    nodeSpecifics: defaultSpecifics,
    icons: icons(),
    inputControls: { ...inputControls },
    controls: [...(defaultControls as Control[])],
    panelItems: defaultPanelGroupsFactory(),
    nodeTypes: async () => {
      throw new Error('Node type not found');
    },
    capabilities: [],
    toolbarButtons: DefaultToolbarButtons(),
    schemas: AllSchemas,
  } as RegistryState,
  reducers: {
    setSchemas(state, schemas: SchemaObject[]) {
      return {
        ...state,
        schemas,
      };
    },
    setToolbarButtons(state, toolbarButtons: ReactElement[]) {
      return {
        ...state,
        toolbarButtons,
      };
    },
    setCapabilities(state, capabilities: CapabilityFactory[]) {
      return {
        ...state,
        capabilities,
      };
    },
    setNodeTypes: (state, nodeTypes: NodeLoader) => {
      return {
        ...state,
        nodeTypes,
      };
    },
    setSpecifics: (
      state,
      nodeSpecifics: Record<string, React.FC<{ node: Node }>>,
    ) => {
      return {
        ...state,
        nodeSpecifics,
      };
    },
    setControls(state, controls: Control[]) {
      return {
        ...state,
        controls,
      };
    },
    registerIcons(state, payload: Record<string, React.ReactNode>) {
      return {
        ...state,
        icons: {
          ...state.icons,
          ...payload,
        },
      };
    },
    registerInputControl(
      state,
      payload: { key: string; value: React.FC<{ node: Node }> },
    ) {
      return {
        ...state,
        inputControls: {
          ...state.inputControls,
          [payload.key]: payload.value,
        },
      };
    },
    setPanelItems(state, payload: DropPanelStore) {
      return {
        ...state,
        panelItems: payload,
      };
    },
  },
});
