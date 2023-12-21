import { RematchDispatch, init } from '@rematch/core';
import { RootModel, models } from './models/index.ts';
import { SettingsState } from './models/settings.ts';
import { UIState } from './models/ui.ts';
import { GraphState } from './models/graph.ts';

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
  settings: SettingsState;
  ui: UIState;
};
