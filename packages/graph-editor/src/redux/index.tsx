import { Provider } from 'react-redux';
import React, { useEffect, useMemo } from 'react';
import { store } from './store.js';

export const ReduxProvider = ({ children, panelItems, capabilities, icons }) => {


  useEffect(() => {
    store.dispatch.registry.registerIcons(icons || {});
  }, [icons]);

  useEffect(() => {
    store.dispatch.registry.setPanelItems(panelItems);
  }, [panelItems]);

  useEffect(() => {
    store.dispatch.registry.setCapabilities(capabilities || []);
  }, [capabilities]);


  return <Provider store={store}>{children}</Provider>;
};
