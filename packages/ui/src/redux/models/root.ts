import { Models } from '@rematch/core';
import { inputState } from './input.ts';
import { nodeState } from './node.ts';
import { outputState } from './output.ts';
import { uiState } from './ui.ts';

export interface RootModel extends Models<RootModel> {
  ui: typeof uiState;
  output: typeof outputState;
  //@ts-ignore
  node: typeof nodeState;
  input: typeof inputState;
}
