import React, { createContext, useContext, useMemo } from 'react';

interface ExternalSetData {
  tokens: Record<string, unknown>[];
}

export interface EditorExternalSet {
  name: string;
  identifier: string;
}

type ExternalDataContextType = {
  tokenSets?: EditorExternalSet[];
  loadingTokenSets: boolean;
  loadSetTokens: (identifier: string) => Promise<ExternalSetData>;
};

const ExternalDataContext = createContext<ExternalDataContextType>({
  tokenSets: undefined,
  loadingTokenSets: false,
  loadSetTokens: async () => ({ tokens: [] }),
});

function ExternalDataContextProvider({
  children,
  tokenSets,
  loadSetTokens,
  loadingTokenSets,
}: {
  children: React.ReactNode;
  tokenSets?: EditorExternalSet[];
  loadingTokenSets: boolean;
  loadSetTokens: (identifier: string) => Promise<ExternalSetData>;
}) {
  const providerValue = useMemo(
    () => ({ tokenSets, loadSetTokens, loadingTokenSets }),
    [tokenSets, loadSetTokens, loadingTokenSets],
  );

  return (
    <ExternalDataContext.Provider value={providerValue}>
      {children}
    </ExternalDataContext.Provider>
  );
}

function useExternalData() {
  const context = useContext(ExternalDataContext);

  if (context === undefined) {
    console.error(
      'useExternalData must be used within a ExternalDataContextProvider',
    );
  }
  return context;
}

export { ExternalDataContextProvider, useExternalData };
