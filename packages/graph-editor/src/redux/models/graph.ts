import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { Graph } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';


export interface ILog{
  data: Record<string,any>;
  time: Date;
  type: 'info' | 'error' | 'warning';
}

export interface GraphState {
  graph: Graph;
  currentNode: string;
  flow: Record<string, ReactFlowInstance>;
  logs: ILog[];
}

export const graphState = createModel<RootModel>()({
  state: {
    flow: {},
    currentNode: '',
    graph: new Graph(),
    logs: [],
  } as GraphState,
  reducers: {
    setCurrentNode(state, payload: string) {
      return {
        ...state,
        currentNode: payload,
      };
    },
    checkClearSelectedNode(state, payload: string) {

      if (state.currentNode === payload) {
        return {
          ...state,
          currentNode: '',
        };
      }
      return state;
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
    appendLog(state, payload: ILog) {
      return {
        ...state,
        logs: [...state.logs, payload],
      };
    },

    clearLogs(state) {
      return {
        ...state,
        logs: [],
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
