import { Models } from '@rematch/core';
import { graphState } from './graph.js';
import { refState } from './refs.js';
import { registryState } from './registry.js';
import { settingsState } from './settings.js';
import { uiState } from './ui.js';

export interface RootModel extends Models<RootModel> {
  settings: typeof settingsState;
  ui: typeof uiState;
  graph: typeof graphState;
  refs: typeof refState;
  registry: typeof registryState;
}
