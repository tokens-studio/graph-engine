import { createSelector } from 'reselect';
import { refs } from './roots.ts';
import { MutableRefObject } from 'react';
import { ImperativeEditorRef } from '@/editor/editorTypes.ts';
import DockLayout from 'rc-dock';

export const dockerSelector = createSelector(refs, (state) => state.docker as MutableRefObject<DockLayout>);
export const graphEditorSelector = createSelector(
  refs,
  (state) => state.graphEditor as MutableRefObject<ImperativeEditorRef>,
);
