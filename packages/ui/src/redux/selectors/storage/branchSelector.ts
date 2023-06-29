import { createSelector } from 'reselect';
import { storageStateSelector } from '../states/index.ts';

export const branchSelector = createSelector(
  storageStateSelector,
  (state) => state.branchState,
);
