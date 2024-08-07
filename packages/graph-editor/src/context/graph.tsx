import { FullyFeaturedGraph } from '@/types/index.js';
import { Graph } from '@tokens-studio/graph-engine';
import React, { createContext, useContext, useMemo } from 'react';

type GraphContextType = {
  graph: FullyFeaturedGraph;
};

const GraphContext = createContext<GraphContextType>({
  graph: new Graph() as unknown as FullyFeaturedGraph,
});

function GraphContextProvider({
  graph,
  children,
}: {
    graph: FullyFeaturedGraph;
  children: React.ReactNode;
}) {
  const providerValue = useMemo(() => ({ graph }), [graph]);

  return (
    <GraphContext.Provider value={providerValue}>
      {children}
    </GraphContext.Provider>
  );
}

function useLocalGraph(): FullyFeaturedGraph {
  return useContext(GraphContext).graph;
}

export { GraphContextProvider, useLocalGraph };
