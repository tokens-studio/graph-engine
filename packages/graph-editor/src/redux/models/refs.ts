import { MutableRefObject } from 'react';
import { RootModel } from './root.js';
import { createModel } from '@rematch/core';

export interface RefState {
  [key: string]: MutableRefObject<any>;
}

export const refState = createModel<RootModel>()({
  state: {} as RefState,
  reducers: {
    setRef(state, payload: { key: string; value: MutableRefObject<any> }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
  },
});
