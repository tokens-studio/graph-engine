import { createSelector } from 'reselect';
import { ui } from './roots.ts';


export const showNodesCmdPaletteSelector = createSelector(
  ui,
  (state) => state.showNodesCmdPalette,
);

export const storeNodeInsertPositionSelector = createSelector(
  ui,
  (state) => state.storeNodeInsertPosition,
);
