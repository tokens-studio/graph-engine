import { RootModel } from './root.ts';
import { uiState } from './ui.ts';
import { journeyState } from './journey.ts';
import { outputState } from './output.tsx';
import { refState } from './refs.ts';
import { graphState } from './graphs.ts';

export const models: RootModel = {
  ui: uiState,
  journey: journeyState,
  editorOutput: outputState,
  refs: refState,
  graph: graphState,
};

export type { RootModel } from './root.ts';
