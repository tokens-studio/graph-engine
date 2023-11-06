import { createSelector } from 'reselect';
import { storageStateSelector } from '../states/index.ts';

export const showPullDialogSelector = createSelector(
  storageStateSelector,
  (state) => state.showPullDialog,
);

export const provider = createSelector(
  storageStateSelector,
  (state) => state.provider,
);

export const lastSynccedState = createSelector(
  storageStateSelector,
  (state) => state.lastSynccedState,
);
