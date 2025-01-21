import { GraphState } from './models/graph.js';
import { RefState } from './models/refs.js';
import { RegistryState } from './models/registry.js';
import { RematchDispatch, init } from '@rematch/core';
import { RootModel, models } from './models/index.js';
import { UIState } from './models/ui.js';

export const store = init({
  models,
  name: 'graph-editor-store',
  redux: {
    devtoolOptions: {},
    rootReducers: {
      RESET_APP: () => undefined,
    },
  },
});

export type Dispatch = RematchDispatch<RootModel>;
export type RootState = {
  graph: GraphState;
  ui: UIState;
  refs: RefState;
  registry: RegistryState;
};
