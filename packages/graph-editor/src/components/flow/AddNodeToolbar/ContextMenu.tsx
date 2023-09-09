import { Menu } from 'react-contexify';
import React from 'react';
import { XYPosition } from 'reactflow';

export interface IDropPanelContextMenuProps {
  id: string;
  position: XYPosition;
}

export const DropPanelContextMenu = (props: IDropPanelContextMenuProps) => {
  const { id } = props;
  return <Menu id={id}>foo</Menu>;
};
