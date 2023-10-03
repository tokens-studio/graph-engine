import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from 'react-contexify';
import React, { useCallback } from 'react';
import { useReactFlow, Node } from 'reactflow';

export interface INodeContextMenuProps {
  id: string;
  node: Node | null;
}

export const NodeContextMenu = ({ id, node }: INodeContextMenuProps) => {
  const reactFlowInstance = useReactFlow();

  const deleteEl = useCallback(() => {
    if (node) {
      reactFlowInstance.deleteElements({ nodes: [node] });
    }
  }, [node, reactFlowInstance]);

  const focus = useCallback(() => {
    if (node) {
      reactFlowInstance?.setCenter(
        node.position.x + (node.width || 0) / 2,
        node.position.y + (node.height || 0) / 2,
        {
          duration: 200,
          zoom: 1,
        },
      );
    }
  }, [node, reactFlowInstance]);

  return (
    <Menu id={id}>
      <Item onClick={focus}>Focus</Item>
      <Item onClick={deleteEl}>Delete</Item>
    </Menu>
  );
};
