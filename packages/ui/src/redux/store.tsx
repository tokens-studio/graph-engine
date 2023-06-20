import { InputState } from './models/input.ts';
import { NodeState } from './models/node.ts';
import { OutputState } from './models/output.ts';
import { RematchDispatch, init } from '@rematch/core';
import { RootModel, models } from './models/index.ts';
import { UIState } from './models/ui.ts';

export const store = init({
  models,
  redux: {
    devtoolOptions: {},
    rootReducers: {
      RESET_APP: () => undefined,
    },
  },
});

export type Dispatch = RematchDispatch<RootModel>;
export type RootState = {
  output: OutputState;
  node: NodeState;
  input: InputState;
  ui: UIState;
};
