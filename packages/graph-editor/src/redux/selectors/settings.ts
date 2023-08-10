import { createSelector } from 'reselect';
import { settings } from './roots.ts';

export const edgeType = createSelector(settings, (state) => state.edgeType);

export const layoutType = createSelector(settings, (state) => state.layoutType);

export const obscureDistance = createSelector(
  settings,
  (state) => state.obscureDistance,
);
