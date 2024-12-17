import { Graph } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';

export const clear = (reactFlowInstance: ReactFlowInstance, graph: Graph) => {
  graph.clear();
  reactFlowInstance.setNodes([]);
  reactFlowInstance.setEdges([]);
};
