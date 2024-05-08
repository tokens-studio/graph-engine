import { createSelector } from 'reselect';
import { settings } from './roots.js';

export const edgeType = createSelector(settings, (state) => state.edgeType);

export const layoutType = createSelector(settings, (state) => state.layoutType);

export const obscureDistance = createSelector(
  settings,
  (state) => state.obscureDistance,
);

export const debugMode = createSelector(settings, (state) => state.debugMode);
export const inlineTypes = createSelector(
  settings,
  (state) => state.inlineTypes,
);

export const showGrid = createSelector(settings, (state) => state.showGrid);

export const snapGrid = createSelector(settings, (state) => state.snapGrid);
export const showTimings = createSelector(
  settings,
  (state) => state.showTimings,
);


export const delayedUpdateSelector = createSelector(settings, (state) => state.delayedUpdate);