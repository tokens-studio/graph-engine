import { Menu } from 'react-contexify';
import React from 'react';
import { XYPosition } from 'reactflow';
import DropPanel from './PanelItems';
import { ContextMenuNodes } from '../AddNodesContextMenu/AddNodesContextMenu';

export interface IDropPanelContextMenuProps {
  id: string;
  position: XYPosition;
  onSelectItem: (item: any) => void;
}

export const DropPanelContextMenu = (props: IDropPanelContextMenuProps) => {
  const { id } = props;
  return <Menu id={id}><ContextMenuNodes onSelectItem={props.onSelectItem} /></Menu>;
};
