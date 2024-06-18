import { createSelector } from 'reselect';
import { refs } from './roots.js';
import { MutableRefObject } from 'react';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import DockLayout from 'rc-dock';

export const dockerSelector = createSelector(refs, (state) => state.docker as MutableRefObject<DockLayout>);
