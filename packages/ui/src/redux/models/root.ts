import { Models } from '@rematch/core';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { outputState } from './output.tsx';

export interface RootModel extends Models<RootModel> {
  ui: typeof uiState;
  journey: typeof journeyState;
  editorOutput: typeof outputState
}
