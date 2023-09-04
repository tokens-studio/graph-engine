import { RootModel } from './root.ts';
import { inputState } from './input.ts';
import { nodeState } from './node.ts';
import { settingsState } from './settings.ts';
import { graphState } from './graph.ts';

export const models: RootModel = {
  node: nodeState,
  input: inputState,
  graph: graphState,
  settings: settingsState,
};

export type { RootModel } from './root.ts';
