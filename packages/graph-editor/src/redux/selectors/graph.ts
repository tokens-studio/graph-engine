import { createSelector } from 'reselect';
import { graph } from './roots.ts';

export const forceUpdate = createSelector(graph, (state) => state.forceUpdate);
