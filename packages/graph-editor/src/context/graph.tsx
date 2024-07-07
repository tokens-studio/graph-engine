import { Graph } from '@tokens-studio/graph-engine';
import React, { createContext, useContext, useMemo } from 'react';

type GraphContextType = {
  graph: Graph;
};

const GraphContext = createContext<GraphContextType>({
  graph: new Graph(),
});

function GraphContextProvider({
  graph,
  children,
}: {
  graph: Graph;
  children: React.ReactNode;
}) {
  const providerValue = useMemo(() => ({ graph }), [graph]);

  return (
    <GraphContext.Provider value={providerValue}>
      {children}
    </GraphContext.Provider>
  );
}

function useLocalGraph(): Graph {
  return useContext(GraphContext).graph;
}

export { GraphContextProvider, useLocalGraph };
