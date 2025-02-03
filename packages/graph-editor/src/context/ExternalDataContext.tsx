import React, { createContext, useContext, useMemo } from 'react';

interface ExternalSetData {
  tokens: Record<string, unknown>[];
}

export interface EditorExternalSet {
  name: string;
  type: 'Static' | 'Dynamic';
  identifier: string;
  containsThemeContextNode?: boolean;
  referencedDynamicSets?: string;
}

type ExternalDataContextType = {
  tokenSets?: EditorExternalSet[];
  loadSetTokens: (identifier: string) => Promise<ExternalSetData>;
};

const ExternalDataContext = createContext<ExternalDataContextType>({
  tokenSets: undefined,
  loadSetTokens: async () => ({ tokens: [] }),
});

function ExternalDataContextProvider({
  children,
  tokenSets,
  loadSetTokens,
}: {
  children: React.ReactNode;
  tokenSets?: EditorExternalSet[];
  loadSetTokens: (identifier: string) => Promise<ExternalSetData>;
}) {
  const providerValue = useMemo(
    () => ({ tokenSets, loadSetTokens }),
    [tokenSets, loadSetTokens],
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
