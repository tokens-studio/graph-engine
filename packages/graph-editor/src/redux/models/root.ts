import { Models } from '@rematch/core';
import { settingsState } from './settings.ts';
import { graphState } from './graph.ts';
import { uiState } from './ui.ts';

export interface RootModel extends Models<RootModel> {
  settings: typeof settingsState;
  ui: typeof uiState;
  graph: typeof graphState;
}
