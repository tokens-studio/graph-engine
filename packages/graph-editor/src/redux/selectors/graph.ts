import { createSelector } from 'reselect';
import { graph } from './roots.ts';


export const currentNode = createSelector(graph, (state) => state.currentNode);

export const graphSelector = createSelector(graph, (state) => state.graph);