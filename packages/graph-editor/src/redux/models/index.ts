import { RootModel } from './root.ts';

import { settingsState } from './settings.ts';
import { uiState } from './ui.ts';
import { graphState } from './graph.ts';

export const models: RootModel = {
  graph: graphState,
  settings: settingsState,
  ui: uiState,
};

export type { RootModel } from './root.ts';
