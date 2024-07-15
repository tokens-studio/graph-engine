import { ExternalLoader } from '@tokens-studio/graph-engine';
import React, { createContext, useContext } from 'react';

const ExternalLoaderContext = createContext<ExternalLoader | undefined>(
  undefined,
);

function ExternalLoaderProvider({
  children,
  externalLoader,
}: {
  children: React.ReactNode;
  externalLoader?: ExternalLoader;
}) {
  return (
    <ExternalLoaderContext.Provider value={externalLoader}>
      {children}
    </ExternalLoaderContext.Provider>
  );
}

function useExternalLoader() {
  const context = useContext(ExternalLoaderContext);

  return context;
}

export { ExternalLoaderProvider, useExternalLoader };
