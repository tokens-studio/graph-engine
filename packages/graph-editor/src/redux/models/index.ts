import { RootModel } from './root.js';

import { graphState } from './graph.js';
import { refState } from './refs.js';
import { registryState } from './registry.js';
import { uiState } from './ui.js';

export const models: RootModel = {
  graph: graphState,
  ui: uiState,
  refs: refState,
  registry: registryState,
};

export type { RootModel } from './root.js';
