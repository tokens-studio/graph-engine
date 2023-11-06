import { Models } from '@rematch/core';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { refState } from './refs.ts';
import { graphState } from './graphs.ts';
import { storageState } from './storage.ts';
import { branchState } from './branch.ts';
import { refState } from './refs.ts';
import { graphState } from './graphs.ts';

export interface RootModel extends Models<RootModel> {
  ui: typeof uiState;
  journey: typeof journeyState;
  refs: typeof refState;
  graph: typeof graphState;
  branch: typeof branchState;
  storage: typeof storageState;
  refs: typeof refState;
  graph: typeof graphState;
}
