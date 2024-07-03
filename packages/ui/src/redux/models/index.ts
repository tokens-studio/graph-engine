import { RootModel } from './root.ts';
import { journeyState } from './journey.ts';
import { refState } from './refs.ts';
import { uiState } from './ui.ts';

export const models: RootModel = {
  ui: uiState,
  journey: journeyState,
  refs: refState,
};

export type { RootModel } from './root.ts';
