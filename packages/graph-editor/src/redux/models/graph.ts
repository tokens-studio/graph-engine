import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { Graph } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';

export interface GraphState {
  graph: Graph;
  currentNode: string;
  flow: Record<string, ReactFlowInstance>;
}

export const graphState = createModel<RootModel>()({
  state: {
    flow: {},
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

    registerFlow(state, payload: { key: string; value: ReactFlowInstance }) {
      return {
        ...state,
        flow: {
          ...state.flow,
          [payload.key]: payload.value,
        },
      };
    },

    setGraph(state, graph: Graph) {
      return {
        ...state,
        graph,
      };
    },
  },
});
