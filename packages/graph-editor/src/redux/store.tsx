import { InputState } from './models/input.ts';
import { NodeState } from './models/node.ts';
import { OutputState } from './models/output.ts';
import { RematchDispatch, init } from '@rematch/core';
import { RootModel, models } from './models/index.ts';
import { SettingsState } from './models/settings.ts';
import React from 'react';


export const store = init({
  models,
  name: 'graph-editor-store',
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
  settings: SettingsState;
};
