import { createSelector } from 'reselect';
import { graph } from './roots.js';

export const currentNode = createSelector(graph, (state) => state.currentNode);

export const graphSelector = createSelector(graph, (state) => state.graph);

export const logSelector = createSelector(graph, (state) => state.logs);

export const playStateSelector = createSelector(graph, (state) => state.graphPlayState);

export const graphEditorSelector = createSelector(
    graph,
    (state) => state.currentPanel?.ref
);
