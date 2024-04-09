import { Provider } from 'react-redux';
import React, { useEffect, useMemo } from 'react';
import { store } from './store.tsx';

export const ReduxProvider = ({ children, panelItems }) => {

  useEffect(() => {

      store.dispatch.registry.setPanelItems(panelItems);
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
