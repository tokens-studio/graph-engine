import { TokenSet } from '@tokens-studio/sdk';
import { SingleToken } from '@tokens-studio/types';
import React, { createContext, useContext, useMemo } from 'react';

type ExternalDataContextType = {
  tokenSets?: TokenSet[]
  loadingTokenSets: boolean,
  loadSetTokens: (urn: string) => Promise<SingleToken[]>
};

const ExternalDataContext = createContext<ExternalDataContextType | undefined>(
  undefined,
);

function ExternalDataContextProvider({
  children,
  tokenSets,
  loadSetTokens,
  loadingTokenSets,
}: {
  children: React.ReactNode;
  tokenSets?: TokenSet[]
  loadingTokenSets: boolean,
  loadSetTokens: (urn: string) => Promise<SingleToken[]>
}) {
  const providerValue = useMemo(() => ({ tokenSets, loadSetTokens, loadingTokenSets }), [tokenSets, loadSetTokens, loadingTokenSets]);

  return (
    <ExternalDataContext.Provider value={providerValue}>
      {children}
    </ExternalDataContext.Provider>
  );
}

function useExternalData() {
  const context = useContext(ExternalDataContext);

  if (context === undefined) {
    throw new Error(
      'useExternalData must be used within a ExternalDataContextProvider',
    );
  }
  return context;
}

export { ExternalDataContextProvider, useExternalData };
