import { RootModel } from './root.ts';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { refState } from './refs.ts';
import { storageState } from './storage.ts';

export const models: RootModel = {
  ui: uiState,
  journey: journeyState,
  refs: refState,
  storage: storageState,
};

export type { RootModel } from './root.ts';
