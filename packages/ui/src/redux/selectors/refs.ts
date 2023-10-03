import { createSelector } from 'reselect';
import { RootState } from '../store.tsx';

export const refs = (state: RootState) => state.refs;

export const serviceRef = (key: string) =>
  createSelector(refs, (state) => state[key]?.current);
