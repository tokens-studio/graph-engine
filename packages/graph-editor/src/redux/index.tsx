import { Provider } from 'react-redux';
import React, { useEffect } from 'react';
import { store } from './store.js';

export const ReduxProvider = ({ children, nodeTypes, panelItems, capabilities, icons, controls }) => {


  useEffect(() => {
    store.dispatch.registry.registerIcons(icons || {});
  }, [icons]);

  useEffect(() => {
    store.dispatch.registry.setControls(controls);
  }, [controls]);

  useEffect(() => {
    store.dispatch.registry.setNodeTypes(nodeTypes);
  }, [nodeTypes]);


  useEffect(() => {
    store.dispatch.registry.setPanelItems(panelItems);
  }, [panelItems]);

  useEffect(() => {
    store.dispatch.registry.setCapabilities(capabilities || []);
  }, [capabilities]);


  return <Provider store={store}>{children}</Provider>;
};
