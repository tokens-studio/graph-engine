import { createSelector } from 'reselect';
import { ui } from './roots.ts';

export const isSidesheetVisible = createSelector(ui, (state) => state.isSidesheetVisible);