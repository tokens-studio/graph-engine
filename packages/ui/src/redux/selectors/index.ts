import { RootState } from '../store.tsx';
import { ui } from './roots.ts';
import { createSelector } from 'reselect';

export const theme = createSelector(ui, (state) => state.theme);
export const tabs = (state: RootState) => state.ui.tabs;
export const currentTab = createSelector(ui, (state) => state.currentTab);

export const outputSelector = (state: RootState) => state.editorOutput;

export const showJourneySelector = (state: RootState) =>
  state.journey.showJourney;

export const showExamplePickerSelector = (state: RootState) =>
  state.ui.showExamplePicker;
