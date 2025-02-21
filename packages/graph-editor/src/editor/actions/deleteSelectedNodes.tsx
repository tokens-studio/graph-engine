import { Graph } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';
import { annotatedDeleteable } from '@tokens-studio/graph-engine';

type ToastOptions = {
  title: string;
  description: string;
};

export const deleteSelectedNodes = (
  reactFlowInstance: ReactFlowInstance,
  graph: Graph,
  deleteNode: (id: string) => void,
  trigger: (options: ToastOptions) => void,
) => {
  // Delete selected edges
  const edges = reactFlowInstance.getEdges().filter((x) => x.selected);
  reactFlowInstance.deleteElements({ edges });

  // Get and delete selected nodes
  const selectedNodes = reactFlowInstance
    .getNodes()
    .filter((x) => x.selected)
    .map((x) => x.id);

  selectedNodes.forEach((id) => {
    const edgeNode = graph.getNode(id);
    if (edgeNode?.annotations[annotatedDeleteable] === false) {
      trigger({
        title: 'Node not deletable',
        description: `Node ${edgeNode.nodeType()} is not deletable`,
      });
      return;
    }
    deleteNode(id);
  });
};
