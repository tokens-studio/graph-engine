import { MutableRefObject } from 'react';
import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface RefState {
  [key: string]: MutableRefObject<any>;
}

export const refState = createModel<RootModel>()({
  state: {} as RefState,
  reducers: {
    set(state, payload: { key: string; value: MutableRefObject<any> }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
  },
});
