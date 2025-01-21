import {
  AllSchemas,
  Node,
  NodeLoader,
  SchemaObject,
} from '@tokens-studio/graph-engine';
import { DefaultToolbarButtons } from '@/registry/toolbar.js';
import { DropPanelStore } from '@/components/panels/dropPanel/index.js';
import { ReactElement } from 'react';
import { RootModel } from './root.js';
import { createModel } from '@rematch/core';

import { inputControls } from '@/registry/inputControls.js';

export interface RegistryState {
  inputControls: Record<string, React.FC<{ node: Node }>>;
  toolbarButtons: ReactElement[];
  schemas: SchemaObject[];
}

export const registryState = createModel<RootModel>()({
  state: {
    inputControls: { ...inputControls },
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
    setNodeTypes: (state, nodeTypes: NodeLoader) => {
      return {
        ...state,
        nodeTypes,
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
