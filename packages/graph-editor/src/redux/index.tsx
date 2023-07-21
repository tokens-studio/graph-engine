import { Provider } from 'react-redux';
import React from 'react';

import { store } from './store.tsx';

export const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

