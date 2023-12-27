import { Edge, useReactFlow } from 'reactflow';
import { useCallback } from 'react';
import React from 'react';
import GraphLib from 'graphlib';
import { useGraph } from '@/hooks/useGraph';
import { canConvertSchemaTypes } from '@tokens-studio/graph-engine';
const { Graph:CycleGraph, alg } = GraphLib;

export interface IuseIsValidConnection {
  postProcessor?: (params: Edge) => boolean;
}

export interface IuseIsValidConnection {
  postProcessor?: (params: Edge) => boolean;
}

export const useIsValidConnection = ({
  postProcessor,
}: IuseIsValidConnection = {}) => {
  const flow = useReactFlow();
  const graph = useGraph();

  return useCallback(
    (params: Edge) => {


      const target = graph.getNode(params.target);
      const source = graph.getNode(params.source);


      const targetType = target?.inputs[params.targetHandle!].type!;
      const sourceType = source?.outputs[params.sourceHandle!].type!;


      const canConvert = canConvertSchemaTypes(sourceType, targetType);

      if (!canConvert){
        console.warn(`Cannot convert ${sourceType.$id} to ${targetType.$id}`);
        return false;
      }



      // Simulate if adding a node will cause a cycle
      const g = new CycleGraph();
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
