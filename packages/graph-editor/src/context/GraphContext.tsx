import type { Graph } from '@tokens-studio/graph-engine';
import React, { createContext, useContext, useMemo } from 'react';

const GraphContext = createContext<Graph>(undefined as any);

export function GraphProvider({
  children,
  graph,
}: {
  children: React.ReactNode;
  graph: Graph;
}) {
  return (
    <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
  );
}

export function useGraph() {
  return useContext(GraphContext);
}
