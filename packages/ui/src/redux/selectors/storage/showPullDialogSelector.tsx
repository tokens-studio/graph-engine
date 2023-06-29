import { createSelector } from 'reselect';
import { storageStateSelector } from '../states/index.ts';

export const showPullDialogSelector = createSelector(
  storageStateSelector,
  (state) => state.showPullDialog,
);
