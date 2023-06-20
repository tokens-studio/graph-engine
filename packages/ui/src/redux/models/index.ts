import { RootModel } from './root.ts';
import { inputState } from './input.ts';
import { nodeState } from './node.ts';
import { outputState } from './output.ts';
import { uiState } from './ui.ts';

export const models: RootModel = {
  ui: uiState,
  output: outputState,
  node: nodeState,
  input: inputState,
};

export type { RootModel } from './root.ts';
