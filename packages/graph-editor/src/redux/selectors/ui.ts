import { createSelector } from 'reselect';
import { ui } from './roots.ts';

export const showNodesPanelSelector = createSelector(ui, (state) => state.showNodesPanel);

export const showNodesDropdownSelector = createSelector(ui, (state) => state.showNodesDropdown);
