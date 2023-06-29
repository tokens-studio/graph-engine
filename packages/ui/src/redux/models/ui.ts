import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
import { v4 as uuidv4 } from 'uuid';

export type Tab = {
  name: string;
  id: string;
};

export interface UIState {
  currentTab: Tab;
  tabs: Tab[];
  theme: string;
}

const starting = [
  {
    name: 'Card',
    id: '0',
  },
];

export const uiState = createModel<RootModel>()({
  state: {
    currentTab: starting[0],
    tabs: starting,
    theme: 'dark',
  } as UIState,
  reducers: {
    setTheme(state, theme: string) {
      return {
        ...state,
        theme,
      };
    },
    setSelectedTab(state, id: string) {
      const currentTab = state.tabs.find((t) => t.id === id);
      if (!currentTab) {
        return state;
      }
      return {
        ...state,
        currentTab,
      };
    },
    _addTab(state, tab: Tab) {
      return {
        ...state,
        tabs: [...state.tabs, tab],
      };
    },
    removeTab(state, id: string) {
      return {
        ...state,
        tabs: state.tabs.filter((t) => t.id !== id),
      };
    },
  },
  effects: (dispatch) => ({
    addTab(tab: string) {
      const id = uuidv4();
      dispatch.ui._addTab({
        id,
        name: tab,
      });

      return id;
    },
    toggleTheme(_, state) {
      dispatch.ui.setTheme(state.ui.theme === 'light' ? 'dark' : 'light');
    },
  }),
});
