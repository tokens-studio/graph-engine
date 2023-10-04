import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export type GraphEntry = {
  title: string;
  //Duplicate the id
  id: string;
};

export interface GraphState {
  [id: string]: GraphEntry;
}

/**
 * Tracks individual graph tabs and their state
 */
export const graphState = createModel<RootModel>()({
  state: {} as GraphState,
  reducers: {
    setGraphState(state, entry: GraphEntry) {
      return {
        ...state,
        [entry.id]: entry,
      };
    },
  },
});
