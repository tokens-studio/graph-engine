import { Models } from '@rematch/core';
import { journeyState } from './journey.ts';
import { refState } from './refs.ts';
import { uiState } from './ui.ts';

export interface RootModel extends Models<RootModel> {
  ui: typeof uiState;
  journey: typeof journeyState;
  refs: typeof refState;
}
