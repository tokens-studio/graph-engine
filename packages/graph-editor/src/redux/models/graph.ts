import { Graph, annotatedPlayState } from '@tokens-studio/graph-engine';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { MAIN_GRAPH_ID } from '@/constants.js';
import { RootModel } from './root.js';
import { createModel } from '@rematch/core';
import type { PlayState } from '@tokens-studio/graph-engine';

export interface ILog {
  data: Record<string, never>;
  time: Date;
  type: 'info' | 'error' | 'warning';
}

export interface IPanel {
  graph: Graph;
  ref: ImperativeEditorRef;
}

export interface GraphState {
  graph: Graph | undefined;
  currentNode: string;
  logs: ILog[];
  graphPlayState: PlayState;
  currentPanelId: string;
  currentPanel: IPanel | null;
  panels: Record<string, IPanel>;
}

export const graphState = createModel<RootModel>()({
  state: {
    currentNode: '',
    graph: undefined,
    graphPlayState: 'stopped',
    panels: {},
    currentPanelId: MAIN_GRAPH_ID,
    currentPanel: null,
    logs: [],
  } as GraphState,
  reducers: {
    setCurrentPanel(state, id: string) {
      const currentPanel = state.panels[id] || null;
      return {
        ...state,
        currentPanelId: id,
        currentPanel,
        graph: currentPanel?.graph,
      };
    },
    registerPanel(state, payload: { id: string; panel: IPanel }) {
      const currentPanel =
        payload.id == state.currentPanelId ? payload.panel : state.currentPanel;

      const newState = {
        ...state,
        currentPanel: currentPanel,
        graph: currentPanel?.graph,
        panels: {
          ...state.panels,
          [payload.id]: payload.panel,
        },
      };
      return newState;
    },
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
    appendLog(state, payload: ILog) {
      return {
        ...state,
        logs: [...state.logs, payload],
      };
    },
    startGraph(state) {
      state.graph?.start();
      return {
        ...state,
        graphPlayState: state.graph?.annotations[annotatedPlayState],
      };
    },
    pauseGraph(state) {
      state.graph?.pause();
      return {
        ...state,
        graphPlayState: state.graph?.annotations[annotatedPlayState],
      };
    },
    resumeGraph(state) {
      state.graph?.resume();
      return {
        ...state,
        graphPlayState: state.graph?.annotations[annotatedPlayState],
      };
    },
    stopGraph(state) {
      state.graph?.stop();
      return {
        ...state,
        graphPlayState: state.graph?.annotations[annotatedPlayState],
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
    },
  }),
});
