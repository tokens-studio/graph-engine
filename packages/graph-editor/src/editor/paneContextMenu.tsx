import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from 'react-contexify';
import React, { useCallback } from 'react';
import { useReactFlow, Node } from 'reactflow';
import { useAutoLayout } from './hooks/useAutolayout';
import { useSelector } from 'react-redux';
import { showGrid, snapGrid } from '#/redux/selectors/settings';
import { useDispatch } from '#/hooks';
import { ContextMenuItem } from './ContextMenuStyles';

export interface IPaneContextMenu {
  id: string;
  onSelectItem: (item: any) => void;
}

export const PaneContextMenu = ({ id, onSelectItem }: IPaneContextMenu) => {
  const reactFlowInstance = useReactFlow();
  const showGridValue = useSelector(showGrid);
  const snapGridValue = useSelector(snapGrid);
  const dispatch = useDispatch();

  const recenter = useCallback(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  const setShowGrid = useCallback(() => {
    dispatch.settings.setShowGrid(!showGridValue);
  }, [dispatch.settings, showGridValue]);

  const setSnapGrid = useCallback(() => {
    dispatch.settings.setSnapGrid(!snapGridValue);
  }, [dispatch.settings, snapGridValue]);

  const forceUpdate = useCallback(() => {
    dispatch.graph.forceNewUpdate();
  }, [dispatch.graph]);

  const clear = useCallback(() => {
    reactFlowInstance.setNodes([]);
    reactFlowInstance.setEdges([]);
  }, [reactFlowInstance]);

  const layout = useAutoLayout();
  return (
    <Menu id={id} preventDefaultOnKeydown animation="">
      <ContextMenuItem onClick={layout}>Apply Layout</ContextMenuItem>
      <ContextMenuItem onClick={setShowGrid}>{showGridValue ? 'Hide' : 'Show'} Grid</ContextMenuItem>
      <ContextMenuItem onClick={recenter}>Recenter</ContextMenuItem>
      <Separator />
      <ContextMenuItem onClick={setSnapGrid}>Snap Grid</ContextMenuItem>
      <ContextMenuItem onClick={forceUpdate}>Force Update</ContextMenuItem>
      <Separator />
      <ContextMenuItem onClick={clear}>Clear</ContextMenuItem>
    </Menu>
  );
};
