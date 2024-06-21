import { annotatedDeleteable } from '@tokens-studio/graph-engine';
import { useLocalGraph } from './useLocalGraph';

export const useCanDeleteNode = (nodeId: string) => {
  const graph = useLocalGraph();
  const node = graph.getNode(nodeId);

  if (node && node.annotations[annotatedDeleteable] === false) {
    return false;
  }

  return true;
};
