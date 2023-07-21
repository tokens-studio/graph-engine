import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

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
        name: rootState.ui.currentTab.name,
        value: payload,
      });
    },
  }),
});
