import { createSelector } from 'reselect';
import { refs } from './roots.ts';

export const dockerSelector = createSelector(refs, (state) => state.docker);
export const graphEditorSelector = createSelector(
  refs,
  (state) => state.graphEditor,
);
