import { Edge, useReactFlow } from 'reactflow';
import { useCallback } from 'react';
import GraphLib from 'graphlib';
import { useGraph } from '@/hooks/useGraph';
import { canConvertSchemaTypes } from '@tokens-studio/graph-engine';
import { stripVariadic } from '@/utils/stripVariadic';
import { useLocalGraph } from './useLocalGraph';
const { Graph: CycleGraph, alg } = GraphLib;

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
  const graph = useLocalGraph();

  return useCallback(
    (params: Edge) => {
      const target = graph.getNode(params.target);
      const source = graph.getNode(params.source);

      if (!target || !source) {
        return false;
      }

      if (target.id === source.id) {
        //Do not allow connections to self
        return false;
      }

      const strippedVariadic = stripVariadic(params.targetHandle!);

      //Check if the target is variadic
      if (target.inputs[strippedVariadic].variadic) {
        return true;
      }

      const targetType = target?.inputs[strippedVariadic].type!;
      const sourceType = source?.outputs[params.sourceHandle!].type!;

      const canConvert = canConvertSchemaTypes(sourceType, targetType);

      if (!canConvert) {
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
