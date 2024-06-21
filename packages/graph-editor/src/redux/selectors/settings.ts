import { createSelector } from 'reselect';
import { settings } from './roots.js';

export const edgeType = createSelector(settings, (state) => state.edgeType);

export const layoutType = createSelector(settings, (state) => state.layoutType);

export const debugMode = createSelector(settings, (state) => state.debugMode);
export const inlineTypes = createSelector(
  settings,
  (state) => state.inlineTypes,
);
export const inlineValues = createSelector(
  settings,
  (state) => state.inlineValues,
);

export const showGrid = createSelector(settings, (state) => state.showGrid);

export const snapGrid = createSelector(settings, (state) => state.snapGrid);
export const showTimings = createSelector(
  settings,
  (state) => state.showTimings,
);

export const showMinimapSelector = createSelector(
  settings,
  (state) => state.showMinimap,
);

export const delayedUpdateSelector = createSelector(
  settings,
  (state) => state.delayedUpdate,
);
export const showSearchSelector = createSelector(
  settings,
  (state) => state.showSearch,
);
export const connectOnClickSelector = createSelector(
  settings,
  (state) => state.connectOnClick,
);
