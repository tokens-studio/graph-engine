import { createSelector } from 'reselect';
import { RootState } from '../store.tsx';

export const graphs = (state: RootState) => state.graph;

export const editorTab = (id: string) =>
  createSelector(graphs, (state) => state[id]);
