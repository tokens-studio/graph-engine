import { createSelector } from 'reselect';
import { ui } from './roots.js';

export const showNodesCmdPaletteSelector = createSelector(
  ui,
  (state) => state.showNodesCmdPalette,
);

export const storeNodeInsertPositionSelector = createSelector(
  ui,
  (state) => state.storeNodeInsertPosition,
);

export const contextMenuSelector = createSelector(
  ui,
  (state) => state.contextMenus,
);
