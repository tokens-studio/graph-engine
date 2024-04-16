import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { Graph, annotatedPlayState } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';
import type { CapabilityFactory, PlayState } from '@tokens-studio/graph-engine';

export interface ILog {
  data: Record<string, any>;
  time: Date;
  type: 'info' | 'error' | 'warning';
}

export interface GraphState {
  graph: Graph;
  currentNode: string;
  flow: Record<string, ReactFlowInstance>;
  logs: ILog[];
  graphPlayState: PlayState;

}

export const graphState = createModel<RootModel>()({
  state: {
    flow: {},
    currentNode: '',
    graph: new Graph(),
    graphPlayState: 'stopped',

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

    startGraph(state) {
      state.graph.start();
      return {
        ...state,
        graphPlayState: state.graph.annotations[annotatedPlayState]
      };
    },
    pauseGraph(state) {
      state.graph.pause();
      return {
        ...state,
        graphPlayState: state.graph.annotations[annotatedPlayState]
      };
    },
    resumeGraph(state) {
      state.graph.resume();
      return {
        ...state,
        graphPlayState: state.graph.annotations[annotatedPlayState]
      };
    },
    stopGraph(state) {
      state.graph.stop();
      return {
        ...state,
        graphPlayState: state.graph.annotations[annotatedPlayState]
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
  effects: (dispatch) => ({
    async startGraph() {
      dispatch.graph.appendLog({
        data: {
          msg: 'Graph started',
        },
        time: new Date(),
        type: 'info',
      });
    },
    async stopGraph() {
      dispatch.graph.appendLog({
        data: {
          msg: 'Graph stopped',
        },
        time: new Date(),
        type: 'info',
      });
    },
    async resumeGraph() {
      dispatch.graph.appendLog({
        data: {
          msg: 'Graph resumed',
        },
        time: new Date(),
        type: 'info',
      });
    },
    async pauseGraph() {
      dispatch.graph.appendLog({
        data: {
          msg: 'Graph paused',
        },
        time: new Date(),
        type: 'info',
      });
    }
  }),
});
