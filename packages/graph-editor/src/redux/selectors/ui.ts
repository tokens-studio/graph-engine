import { createSelector } from 'reselect';
import { ui } from './roots.ts';

export const showNodesPanelSelector = createSelector(
  ui,
  (state) => state.showNodesPanel,
);

export const showNodesCmdPaletteSelector = createSelector(
  ui,
  (state) => state.showNodesCmdPalette,
);

export const storeNodeInsertPositionSelector = createSelector(
  ui,
  (state) => state.storeNodeInsertPosition,
);
