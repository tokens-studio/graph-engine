import { Edge, useReactFlow } from 'reactflow';
import { Graph, alg } from 'graphlib';
import { useCallback } from 'react';

export const useIsValidConnection = (
  postProcessor?: (params: Edge) => boolean,
) => {
  const flow = useReactFlow();
  return useCallback(
    (params: Edge) => {
      // Simulate if adding a node will cause a cycle
      const g = new Graph();
      const nodes = flow.getNodes();
      const edges = flow.getEdges();

      nodes.forEach((node) => {
        g.setNode(node.id);
      });

      edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
      });

      //Now add the new edge
      g.setEdge(params.source, params.target);

      if (!alg.isAcyclic(g)) {
        console.warn('You cannot introduce cycles into the graph');
        return false;
      }
      return postProcessor ? postProcessor(params) : true;
    },
    [postProcessor],
  );
};
