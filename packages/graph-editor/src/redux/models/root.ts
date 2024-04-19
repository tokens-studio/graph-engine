import { Models } from '@rematch/core';
import { settingsState } from './settings.js';
import { graphState } from './graph.js';
import { uiState } from './ui.js';
import { refState } from './refs.js';
import { registryState } from './registry.js';

export interface RootModel extends Models<RootModel> {
  settings: typeof settingsState;
  ui: typeof uiState;
  graph: typeof graphState;
  refs: typeof refState;
  registry: typeof registryState;
}
