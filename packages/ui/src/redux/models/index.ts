import { RootModel } from './root.ts';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { refState } from './refs.ts';


export const models: RootModel = {
  ui: uiState,
  journey: journeyState,
  refs: refState,
};

export type { RootModel } from './root.ts';
