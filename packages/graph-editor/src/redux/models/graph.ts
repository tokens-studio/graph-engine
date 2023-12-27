import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { Graph } from '@tokens-studio/graph-engine';

export interface GraphState {
  graph: Graph;
  currentNode: string;
}

export const graphState = createModel<RootModel>()({
  state: {
    currentNode: '',
    graph: new Graph(),
  } as GraphState,
  reducers: {
    setCurrentNode(state, payload: string) {
      return {
        ...state,
        currentNode: payload,
      };
    },

    setGraph(state, graph: Graph) {
      return {
        ...state,
        graph
      };
    },
  },
});
