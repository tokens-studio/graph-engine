import { RootState } from '../store.tsx';
import { createSelector } from 'reselect';

export const refs = (state: RootState) => state.refs;

export const serviceRef = (key: string) =>
  createSelector(refs, (state) => state[key]?.current);
