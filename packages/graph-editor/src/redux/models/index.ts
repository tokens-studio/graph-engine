import { RootModel } from './root.ts';
import { inputState } from './input.ts';
import { nodeState } from './node.ts';
import { settingsState } from './settings.ts';
import { uiState } from './ui.ts';
import { graphState } from './graph.ts';

export const models: RootModel = {
  node: nodeState,
  input: inputState,
  graph: graphState,
  settings: settingsState,
  ui: uiState,
};

export type { RootModel } from './root.ts';
