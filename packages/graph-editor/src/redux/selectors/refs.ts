import { MutableRefObject } from 'react';
import { createSelector } from 'reselect';
import { refs } from './roots.js';
import type { DockLayout } from 'rc-dock';

export const dockerSelector = createSelector(
  refs,
  (state) => state.docker as MutableRefObject<DockLayout>,
);
