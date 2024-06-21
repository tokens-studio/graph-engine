import { RootState } from '../store.tsx';
import { createSelector } from 'reselect';

export const storage = (state: RootState) => state.storage;

export const storageProviderSelector = createSelector(
  storage,
  (state) => state.storage,
);

export const providersSelector = createSelector(
  storage,
  (state) => state.providers,
);
