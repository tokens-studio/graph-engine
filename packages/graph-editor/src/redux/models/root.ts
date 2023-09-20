import { Models } from '@rematch/core';
import { inputState } from './input.ts';
import { nodeState } from './node.ts';
import { settingsState } from './settings.ts';
import { graphState } from './graph.ts';
import { uiState } from './ui.ts';

export interface RootModel extends Models<RootModel> {
  //@ts-ignore
  node: typeof nodeState;
  input: typeof inputState;
  settings: typeof settingsState;
  ui: typeof uiState;
  graph: typeof graphState;
}
