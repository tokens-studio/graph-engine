import { RootState } from '../store.tsx';
import { ui } from './roots.ts';
import { createSelector } from 'reselect';

export const previewCodeSelector = createSelector(
  ui,
  (state) => state.previewCode,
);
export const showNodesPanelSelector = createSelector(
  ui,
  (state) => state.showNodesPanel,
);

export const showJourneySelector = (state: RootState) =>
  state.journey.showJourney;

export const showExamplePickerSelector = (state: RootState) =>
  state.ui.showExamplePicker;
