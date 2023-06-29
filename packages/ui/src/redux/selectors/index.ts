import { RootState } from '../store.tsx';

export const ui = (state: RootState) => state.ui;
export const theme = (state: RootState) => state.ui.theme;
export const tabs = (state: RootState) => state.ui.tabs;
export const currentTab = (state: RootState) => state.ui.currentTab;
export const output = (state: RootState) => state.output;
export const stateSelector = (id: string) => (state: RootState) =>
  state.node[id];
export const inputSelector = (id: string) => (state: RootState) =>
  state.input[id];

export const showJourneySelector = (state: RootState) =>
  state.journey.showJourney;

const all = {
  ui,
  tabs,
  currentTab,
  output,
};
export default all;
