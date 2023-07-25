import { RootState } from '../store.tsx';

export const theme = (state: RootState) => state.ui.theme;
export const tabs = (state: RootState) => state.ui.tabs;
export const currentTab = (state: RootState) => state.ui.currentTab;

export const showJourneySelector = (state: RootState) =>
  state.journey.showJourney;
