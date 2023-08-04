import { TokenSet } from '@tokens-studio/sdk';
import { SingleToken } from '@tokens-studio/types';
import React, { createContext, useContext, useMemo } from 'react';
import { ExternalSet } from '../editor/editorTypes';

type ExternalDataContextType = {
  tokenSets?: TokenSet[]
  loadingTokenSets: boolean,
  loadSetTokens: (urn: string) => Promise<ExternalSet>
};

const ExternalDataContext = createContext<ExternalDataContextType>(
  {
    tokenSets: undefined,
    loadingTokenSets: false,
    loadSetTokens: async () => ({ tokens: [] }),
  },
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
  loadSetTokens: (urn: string) => Promise<ExternalSet>
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
    console.error('useExternalData must be used within a ExternalDataContextProvider')
  }
  return context;
}

export { ExternalDataContextProvider, useExternalData };
