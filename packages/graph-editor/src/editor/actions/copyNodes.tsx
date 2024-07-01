import { Node, ReactFlowInstance } from 'reactflow';
import { SerializedNode } from '@/types/serializedNode.js';
import { v4 as uuidv4 } from 'uuid';

export const copyNodeAction = (
  reactFlowInstance: ReactFlowInstance,
  graph,
  nodeLookup,
) => {
  return (nodes: SerializedNode[]) => {
    const { addNodes } = nodes.reduce(
      (acc, node) => {
        const newID = uuidv4();
        if (node.engine) {
          const graphNode = graph.getNode(node.engine.id);
          const newGraphNode = graphNode?.factory.deserialize(
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
          addNodes: acc.addNodes.concat(newNode),
        };
      },
      {
        addNodes: [] as Node[],
      },
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
