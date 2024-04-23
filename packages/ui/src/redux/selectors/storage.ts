import { createSelector } from 'reselect';
import { RootState } from '../store.tsx';

export const storage = (state: RootState) => state.storage;

export const storageProviderSelector = createSelector(storage, (state) => state.storage);

export const providersSelector = createSelector(storage, (state) => state.providers);
