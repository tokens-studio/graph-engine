import { RootModel } from './root.ts';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { outputState } from './output.tsx';

export const models: RootModel = {
  ui: uiState,
  journey: journeyState,
  editorOutput: outputState
};

export type { RootModel } from './root.ts';
