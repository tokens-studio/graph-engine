import React, { createContext, useContext } from 'react';

const GraphGeneratorIdContext = createContext<string | undefined>('');

function GraphGeneratorIdProvider({
  children,
  graphGeneratorId,
}: {
  children: React.ReactNode;
  graphGeneratorId?: string;
}) {
  return (
    <GraphGeneratorIdContext.Provider value={graphGeneratorId}>
      {children}
    </GraphGeneratorIdContext.Provider>
  );
}

function useGraphGeneratorId() {
  const context = useContext(GraphGeneratorIdContext);

  return context;
}

export { GraphGeneratorIdProvider, useGraphGeneratorId };
