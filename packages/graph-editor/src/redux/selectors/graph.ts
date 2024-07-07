import { MAIN_GRAPH_ID } from '@/constants.js';
import { createSelector } from 'reselect';
import { graph } from './roots.js';

export const currentNode = createSelector(graph, (state) => state.currentNode);

export const graphSelector = createSelector(graph, (state) => state.graph);

export const logSelector = createSelector(graph, (state) => state.logs);

export const playStateSelector = createSelector(
  graph,
  (state) => state.graphPlayState,
);

export const mainGraphSelector = createSelector(
  graph,
  (state) => state.panels[MAIN_GRAPH_ID],
);

export const graphEditorSelector = createSelector(
  graph,
  (state) => state.currentPanel?.ref,
);

export const currentPanelIdSelector = createSelector(
  graph,
  (state) => state.currentPanelId,
);
