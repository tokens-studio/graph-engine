import { Models } from '@rematch/core';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { outputState } from './output.tsx';
import { refState } from './refs.ts';
import { graphState } from './graphs.ts';
import { storageState } from './storage.ts';
import { branchState } from './branch.ts';

export interface RootModel extends Models<RootModel> {
  ui: typeof uiState;
  journey: typeof journeyState;
  editorOutput: typeof outputState;
  refs: typeof refState;
  graph: typeof graphState;
  branch: typeof branchState;
}
