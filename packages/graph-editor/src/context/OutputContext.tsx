import React, { createContext, useContext, useMemo } from 'react';

type OuptpuChangeContextType = {
  onOutputChange: (output: Record<string, unknown>) => void;
};

const OutputChangeContext = createContext<OuptpuChangeContextType | undefined>(
  undefined,
);

function OnOutputChangeContextProvider({
  children,
  onOutputChange,
}: {
  children: React.ReactNode;
  onOutputChange: (output: Record<string, unknown>) => void;
}) {
  const providerValue = useMemo(() => ({ onOutputChange }), [onOutputChange]);

  return (
    <OutputChangeContext.Provider value={providerValue}>
      {children}
    </OutputChangeContext.Provider>
  );
}

function useOnOutputChange() {
  const context = useContext(OutputChangeContext);

  if (context === undefined) {
    throw new Error(
      'useOnOutputChange must be used within a OnOutputChangeContextProvider',
    );
  }
  return context;
}

export { OnOutputChangeContextProvider, useOnOutputChange };
