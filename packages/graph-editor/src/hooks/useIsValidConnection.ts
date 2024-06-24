import { ANY, canConvertSchemaTypes } from '@tokens-studio/graph-engine';
import { Connection, useReactFlow } from 'reactflow';
import { stripVariadic } from '@/utils/stripVariadic.js';
import { useCallback } from 'react';
import { useLocalGraph } from './useLocalGraph.js';
import GraphLib from '@dagrejs/graphlib';
const { Graph: CycleGraph, alg } = GraphLib;

export interface IuseIsValidConnection {
  postProcessor?: (connection: Connection) => boolean;
}

export interface IuseIsValidConnection {
  postProcessor?: (connection: Connection) => boolean;
}

export const useIsValidConnection = ({
  postProcessor,
}: IuseIsValidConnection = {}) => {
  const flow = useReactFlow();
  const graph = useLocalGraph();

  return useCallback(
    (connection: Connection): boolean => {
      const target = graph.getNode(connection.target!);
      const source = graph.getNode(connection.source!);

      if (!target || !source) {
        return false;
      }

      if (target.id === source.id) {
        //Do not allow connections to self
        return false;
      }

      const strippedVariadic = stripVariadic(connection.targetHandle!);

      let targetType = target?.inputs[strippedVariadic].type;
      let sourceType = connection.sourceHandle
        ? source?.outputs[connection.sourceHandle].type
        : null;

      if (target.inputs[strippedVariadic].type.items) {
        targetType = target.inputs[strippedVariadic].type.items;
      }
      if (source.outputs[connection.sourceHandle!].type.items) {
        sourceType = source.outputs[connection.sourceHandle!].type.items;
      }

      const fullTargetType = target?.inputs[strippedVariadic].fullType();
      //Any types should be allowed to connect to anything
      if (
        fullTargetType.type.$id === ANY ||
        fullTargetType.type.items?.$id === ANY
      ) {
        return true;
      }

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
      g.setEdge(connection.source!, connection.target!);

      if (!alg.isAcyclic(g)) {
        console.warn('You cannot introduce cycles into the graph');
        return false;
      }
      return postProcessor ? postProcessor(connection) : true;
    },
    [flow, graph, postProcessor],
  );
};
