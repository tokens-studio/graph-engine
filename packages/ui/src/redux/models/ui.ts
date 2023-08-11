import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';
export type Tab = {
  name: string;
  id: string;
};

export type ConfirmProps = {
  show?: boolean;
  text?: string;
  description?: React.ReactNode;
  choices?: {
    key: string;
    label: string;
    enabled?: boolean;
    unique?: boolean;
  }[];
  confirmAction?: string;
  cancelAction?: string;
  input?: {
    type: 'text';
    placeholder: string;
  };
};

export interface UIState {
  confirmState: ConfirmProps;
  currentTab: Tab;
  tabs: Tab[];
  theme: string;
  showExamplePicker: boolean;
}

const starting = [
  {
    name: 'Card',
    id: 'editor-0',
  },
];

export const uiState = createModel<RootModel>()({
  state: {
    currentTab: starting[0],
    tabs: starting,
    theme: 'dark',
    showExamplePicker: false,
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
    addTab(state, tab: Tab) {
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
    setShowExamplePicker(state, showExamplePicker: boolean) {
      return {
        ...state,
        showExamplePicker,
      };
    },
  },
  effects: (dispatch) => ({
    toggleTheme(_, state) {
      dispatch.ui.setTheme(state.ui.theme === 'light' ? 'dark' : 'light');
    },
  }),
});
