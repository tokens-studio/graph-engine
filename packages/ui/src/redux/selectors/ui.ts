import { createSelector } from 'reselect';
import { RootState } from '../store.tsx';

export const ui = (state: RootState) => state.ui;