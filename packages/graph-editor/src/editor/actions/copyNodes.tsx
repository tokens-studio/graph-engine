import { Node, ReactFlowInstance } from 'reactflow';
import { SerializedNode } from '@/types/serializedNode.js';
import { nanoid as uuid } from 'nanoid';

export const copyNodeAction = (
  reactFlowInstance: ReactFlowInstance,
  graph,
  nodeLookup,
) => {
  return async (nodes: SerializedNode[]) => {
    const { addNodes } = await nodes.reduce(
      async (acc, node) => {
        const resolvedAcc = await acc;
        const newID = uuid();
        if (node.engine) {
          const graphNode = graph.getNode(node.engine.id);
          const newGraphNode = await graphNode?.factory.deserialize(
            {
              ...node.engine,
              id: newID,
            },
            nodeLookup,
          );

          graph.addNode(newGraphNode);
          //Update immediately
          graph.update(newGraphNode.id);
        }

        const newNode = {
          ...node.editor,
          id: newID,
          position: {
            x: node.editor.position.x + 20,
            y: node.editor.position.y + 100,
          },
        } as Node;

        return {
          addNodes: resolvedAcc.addNodes.concat(newNode),
        };
      },
      Promise.resolve({
        addNodes: [] as Node[],
      }),
    );

    //We also need to duplicate the existing node in the actual graph

    reactFlowInstance.setNodes((existing: Node[]) => {
      return [
        ...existing.map((node) => ({
          ...node,
          //Deselect any existing
          selected: false,
        })),
        ...addNodes,
      ];
    });
  };
};
