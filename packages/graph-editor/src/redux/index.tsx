import { Provider } from 'react-redux';
import { store } from './store.js';
import React, { useEffect } from 'react';

export const ReduxProvider = ({
  children,
  schemas,
  // toolbarButtons,
}) => {
  // useEffect(() => {
  //   if (toolbarButtons) {
  //     store.dispatch.registry.setToolbarButtons(toolbarButtons);
  //   }
  // }, [toolbarButtons]);

  useEffect(() => {
    if (schemas) {
      store.dispatch.registry.setSchemas(schemas);
    }
  }, [schemas]);

  return <Provider store={store}>{children}</Provider>;
};
