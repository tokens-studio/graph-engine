import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { v4 as uuidv4 } from 'uuid';

export interface OutputState {
  [key: string]: Record<string, any>;
}

export const outputState = createModel<RootModel>()({
  state: {} as OutputState,
  reducers: {
    set(state, payload: { name: string; value: any }) {
      return {
        ...state,
        [payload.name]: payload.value,
      };
    },
  },
  effects: (dispatch) => ({
    setCurrentOutput(payload: any, rootState) {
      dispatch.output.set({
        // TODO: fix this
        name: uuidv4(),
        value: payload,
      });
    },
  }),
});
