import { createSelector } from 'reselect';
import { ui } from './roots.ts';

export const showNodesPanelSelector = createSelector(ui, (state) => state.showNodesPanel);
