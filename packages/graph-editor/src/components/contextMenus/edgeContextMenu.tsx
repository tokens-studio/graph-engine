import { Edge, useReactFlow } from 'reactflow';
import { Item, Menu, Separator } from 'react-contexify';
import React, { useCallback } from 'react';

export interface IEdgeContextMenuProps {
  id: string;
  edge: Edge | null;
}

export const EdgeContextMenu = ({ id, edge }: IEdgeContextMenuProps) => {
  const reactFlowInstance = useReactFlow();

  const findOrigin = useCallback(() => {
    const node = reactFlowInstance.getNode(edge?.source as string);
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
  }, [edge, reactFlowInstance]);

  const findTarget = useCallback(() => {
    const node = reactFlowInstance.getNode(edge?.target as string);
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
  }, [edge, reactFlowInstance]);

  const deleteEl = useCallback(() => {
    if (edge) {
      reactFlowInstance.deleteElements({ edges: [edge] });
    }
  }, [edge, reactFlowInstance]);

  return (
    <Menu id={id}>
      <Item onClick={deleteEl}>Delete</Item>
      <Separator />
      <Item onClick={findOrigin}>Find Source</Item>
      <Item onClick={findTarget}>Find Target</Item>
    </Menu>
  );
};
