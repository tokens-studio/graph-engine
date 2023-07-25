import { Provider } from 'react-redux';
import React from 'react';

import { configureStore } from './store.tsx';
import { EdgeType } from './models/settings.ts';

export const ReduxProvider = ({ children }) => {
  const store = configureStore({
    settings: {
      edgeType: EdgeType.smoothStep,
    },
  });

  return <Provider store={store}>{children}</Provider>;
};
