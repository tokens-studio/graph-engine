import { createSelector } from 'reselect';
import { settings } from './roots.ts';

export const edgeType = createSelector(settings, (state) => state.edgeType);
