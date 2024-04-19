import { RootModel } from './root.js';
import { createModel } from '@rematch/core';
import { icons } from '@/registry/icon.js';
import { CapabilityFactory, Node} from '@tokens-studio/graph-engine';
import { inputControls } from '@/registry/inputControls.js';
import { controls } from '@/registry/control.js';
import { defaultSpecifics } from '@/registry/specifics.js';
import { DropPanelStore, defaultPanelGroupsFactory } from '@/components/panels/dropPanel/index.js';
import { Control } from '@/types/controls.js';


export interface RegistryState {
  //Additional specific controls for nodes. Appended to the end of the default controls
  nodeSpecifics: Record<string, React.FC<{ node: Node }>>;
  icons: Record<string, React.ReactNode>;
  inputControls: Record<string, React.FC<{ node: Node }>>;
  controls: Control[];
  panelItems: DropPanelStore;
  capabilities: CapabilityFactory[]
}

export const registryState = createModel<RootModel>()({
  state: {
    nodeSpecifics: defaultSpecifics,
    icons: { ...icons },
    inputControls: { ...inputControls },
    controls: [...(controls as Control[])],
    panelItems: defaultPanelGroupsFactory(),
    capabilities: [],
  } as RegistryState,
  reducers: {
    setCapabilities(state, payload: CapabilityFactory[]) {
      return {
        ...state,
        capabilities: payload,
      };
    },
    registerIcons(state, payload: Record<string, React.ReactNode>) {
      return {
        ...state,
        icons: {
          ...state.icons,
          ...payload
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
