import { RootModel } from './root.ts';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';

export const models: RootModel = {
  ui: uiState,
  journey: journeyState,
};

export type { RootModel } from './root.ts';
