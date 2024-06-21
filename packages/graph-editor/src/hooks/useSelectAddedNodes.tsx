import { Node, useReactFlow } from 'reactflow';

export const useSelectAddedNodes = () => {
  const reactFlowInstance = useReactFlow();

  const selectAddedNodes = (newNodes: Node[]) => {
    reactFlowInstance.setNodes((nds) => {
      return [
        ...nds.map((node) => {
          node.selected = false;
          return node;
        }),
        ...newNodes.map((flowNode) => {
          flowNode.selected = true;
          return flowNode;
        }),
      ];
    });
  };

  return selectAddedNodes;
};
