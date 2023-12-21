import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface GraphState {
  forceUpdate: number;
  currentNode: string;
}

export const graphState = createModel<RootModel>()({
  state: {
    currentNode: '',
    forceUpdate: 0,
  } as GraphState,
  reducers: {
    setCurrentNode(state, payload: string) {
      return {
        ...state,
        currentNode: payload,
      };
    },

    forceNewUpdate(state) {
      return {
        ...state,
        forceUpdate: state.forceUpdate + 1,
      };
    },
  },
});
