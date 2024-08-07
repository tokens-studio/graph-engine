import { FullyFeaturedGraph } from '@/types/index.js';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { MAIN_GRAPH_ID } from '@/constants.js';
import { RootModel } from './root.js';
import {  annotatedPlayState } from '@tokens-studio/graph-engine';
import { createModel } from '@rematch/core';
import type { PlayState } from '@tokens-studio/graph-engine';

export interface ILog {
  data: Record<string, unknown>;
  time: Date;
  type: 'info' | 'error' | 'warning';
}

export interface IPanel {
  graph: FullyFeaturedGraph;
  ref: ImperativeEditorRef;
}

export interface GraphState {
  graph: FullyFeaturedGraph | undefined;
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
      state.graph?.capabilities.controlFlow.start();
      return {
        ...state,
        graphPlayState: state.graph?.annotations[annotatedPlayState],
      };
    },
    pauseGraph(state) {
      state.graph?.capabilities.controlFlow.pause();
      return {
        ...state,
        graphPlayState: state.graph?.annotations[annotatedPlayState],
      };
    },
    resumeGraph(state) {
      state.graph?.capabilities.controlFlow.resume();
      return {
        ...state,
        graphPlayState: state.graph?.annotations[annotatedPlayState],
      };
    },
    stopGraph(state) {
      state.graph?.capabilities.controlFlow.stop();
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
    setGraph(state, graph: FullyFeaturedGraph) {
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
