import { createSelector } from 'reselect';
import { refs } from './roots.ts';
import { MutableRefObject } from 'react';
import { ImperativeEditorRef } from '@/editor/editorTypes.ts';

export const dockerSelector = createSelector(refs, (state) => state.docker);
export const graphEditorSelector = createSelector(
  refs,
  (state) => state.graphEditor as MutableRefObject<ImperativeEditorRef>,
);
