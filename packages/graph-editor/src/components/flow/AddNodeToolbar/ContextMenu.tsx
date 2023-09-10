import { Menu } from 'react-contexify';
import React from 'react';
import { XYPosition } from 'reactflow';
import DropPanel from './PanelItems';

export interface IDropPanelContextMenuProps {
  id: string;
  position: XYPosition;
}

export const DropPanelContextMenu = (props: IDropPanelContextMenuProps) => {
  const { id } = props;
  return <Menu id={id}><DropPanel /></Menu>;
};
