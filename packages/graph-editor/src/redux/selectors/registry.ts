import { createSelector } from 'reselect';
import { registry } from './roots.ts';

export const icons = createSelector(registry, (state) => state.icons);
export const inputControls = createSelector(
  registry,
  (state) => state.inputControls,
);
export const controls = createSelector(registry, (state) => state.controls);
