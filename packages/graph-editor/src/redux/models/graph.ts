import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface GraphState {
  forceUpdate: number;
}

export const graphState = createModel<RootModel>()({
  state: {
    forceUpdate: 0,
  } as GraphState,
  reducers: {
    forceNewUpdate(state) {
      return {
        ...state,
        forceUpdate: state.forceUpdate + 1,
      };
    },
  },
});
