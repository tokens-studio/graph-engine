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
import { ContextMenuNodes } from '#/components/flow/AddNodesContextMenu/AddNodesContextMenu';

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
      <Submenu label="Add Node">
        <ContextMenuNodes onSelectItem={onSelectItem} />
      </Submenu>
      <Item onClick={layout}>Apply Layout</Item>
      <Item onClick={setShowGrid}>{showGridValue ? 'Hide' : 'Show'} Grid</Item>
      <Item onClick={recenter}>Recenter</Item>
      <Separator />
      <Item onClick={setSnapGrid}>Snap Grid</Item>
      <Item onClick={forceUpdate}>Force Update</Item>
      <Separator />
      <Item onClick={clear}>Clear</Item>
    </Menu>
  );
};
