import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { icons } from '@/registry/icon.tsx';
import { Node, SchemaObject } from '@tokens-studio/graph-engine';
import { inputControls } from '@/registry/inputControls.tsx';
import { controls } from '@/registry/control.tsx';
import { IField } from '@/components/controls/interface.tsx';

type Control = {
  matcher: (node: SchemaObject, output: boolean) => boolean;
  component: React.FC<IField>;
};

export interface RegistryState {
  icons: Record<string, React.ReactNode>;
  inputControls: Record<string, React.FC<{ node: Node }>>;
  controls: Control[];
}

export const registryState = createModel<RootModel>()({
  state: {
    icons: { ...icons },
    inputControls: { ...inputControls },
    controls: [...(controls as Control[])],
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
  },
});
