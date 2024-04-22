import { Models } from '@rematch/core';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { refState } from './refs.ts';


export interface RootModel extends Models<RootModel> {
  ui: typeof uiState;
  journey: typeof journeyState;
  refs: typeof refState;

}
