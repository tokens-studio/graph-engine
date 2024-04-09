import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { icons } from '@/registry/icon.tsx';
import { Node, SchemaObject } from '@tokens-studio/graph-engine';
import { inputControls } from '@/registry/inputControls.tsx';
import { controls } from '@/registry/control.tsx';
import { IField } from '@/components/controls/interface.tsx';
import { defaultSpecifics } from '@/registry/specifics.tsx';
import { DropPanelStore, defaultPanelGroupsFactory } from '@/components/panels/dropPanel/index.js';

type Control = {
  matcher: (node: SchemaObject, output: boolean) => boolean;
  component: React.FC<IField>;
};

export interface RegistryState {
  //Additional specific controls for nodes. Appended to the end of the default controls
  nodeSpecifics: Record<string, React.FC<{ node: Node }>>;
  icons: Record<string, React.ReactNode>;
  inputControls: Record<string, React.FC<{ node: Node }>>;
  controls: Control[];
  panelItems: DropPanelStore
}

export const registryState = createModel<RootModel>()({
  state: {
    nodeSpecifics: defaultSpecifics,
    icons: { ...icons },
    inputControls: { ...inputControls },
    controls: [...(controls as Control[])],
    panelItems: defaultPanelGroupsFactory()
  } as RegistryState,
  reducers: {
    registerIcon(state, payload: { key: string; value: React.ReactNode }) {
      return {
        ...state,
        icons: {
          ...state.icons,
          [payload.key]: payload.value,
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
    }
  },
});
