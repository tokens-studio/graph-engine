import { Provider } from 'react-redux';
import { store } from './store.js';
import React, { useEffect } from 'react';

export const ReduxProvider = ({
  children,
  nodeTypes,
  panelItems,
  capabilities,
  icons,
  schemas,
  controls,
  specifics,
  toolbarButtons,
}) => {
  useEffect(() => {
    if (toolbarButtons) {
      store.dispatch.registry.setToolbarButtons(toolbarButtons);
    }
  }, [toolbarButtons]);

  useEffect(() => {
    if (schemas) {
      store.dispatch.registry.setSchemas(schemas);
    }
  }, [schemas]);

  useEffect(() => {
    store.dispatch.registry.registerIcons(icons || {});
  }, [icons]);

  useEffect(() => {
    store.dispatch.registry.setControls(controls);
  }, [controls]);

  useEffect(() => {
    console.log(nodeTypes);
    store.dispatch.registry.setNodeTypes(nodeTypes);
  }, [nodeTypes]);

  useEffect(() => {
    store.dispatch.registry.setSpecifics(specifics);
  }, [specifics]);

  useEffect(() => {
    store.dispatch.registry.setPanelItems(panelItems);
  }, [panelItems]);

  useEffect(() => {
    store.dispatch.registry.setCapabilities(capabilities || []);
  }, [capabilities]);

  return <Provider store={store}>{children}</Provider>;
};
