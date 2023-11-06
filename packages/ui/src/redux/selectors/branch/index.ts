import { RootState } from '#/redux/store.tsx';
import { createSelector } from 'reselect';

export const branchStateSelector = (state: RootState) => state.branch;

export const branch = createSelector(
  branchStateSelector,
  (state) => state.branch,
);

export const branches = createSelector(
  branchStateSelector,
  (state) => state.branches,
);
