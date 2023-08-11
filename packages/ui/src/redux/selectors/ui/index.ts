import { createSelector } from 'reselect';
import { shallowEqual } from 'react-redux';
import { RootState } from '#/redux/store.tsx';

export const uiStateSelector = (state: RootState) => state.ui;

export const confirmStateSelector = createSelector(
  uiStateSelector,
  (state) => state.confirmState,
  {
    memoizeOptions: {
      resultEqualityCheck: shallowEqual,
    },
  },
);
