import { ExternalLoadOptions } from '@tokens-studio/graph-engine';
import React, { createContext, useContext, useMemo } from 'react';

type ExternalLoaderType = {
  externalLoader?: (opts: ExternalLoadOptions) => Promise<unknown> | unknown;
};

const ExternalLoaderContext = createContext<ExternalLoaderType | undefined>(
  undefined,
);

function ExternalLoaderProvider({
  children,
  externalLoader,
}: {
  children: React.ReactNode;
  externalLoader?: (opts: ExternalLoadOptions) => Promise<unknown> | unknown;
}) {
  const providerValue = useMemo(() => ({ externalLoader }), [externalLoader]);

  return (
    <ExternalLoaderContext.Provider value={providerValue}>
      {children}
    </ExternalLoaderContext.Provider>
  );
}

function useExternalLoader() {
  const context = useContext(ExternalLoaderContext);

  if (context === undefined) {
    throw new Error(
      'useExternalLoader must be used within a ExternalLoaderProvider',
    );
  }
  return context;
}

export { ExternalLoaderProvider, useExternalLoader };
