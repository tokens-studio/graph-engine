import { Models } from '@rematch/core';
import { graphState } from './graph.js';
import { refState } from './refs.js';
import { registryState } from './registry.js';
import { uiState } from './ui.js';

export interface RootModel extends Models<RootModel> {
  ui: typeof uiState;
  graph: typeof graphState;
  refs: typeof refState;
  registry: typeof registryState;
}
