import {
  Menu,
  Separator,
} from 'react-contexify';
import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useAutoLayout } from './hooks/useAutolayout';
import { useSelector } from 'react-redux';
import { showGrid, snapGrid } from '@/redux/selectors/settings';
import { useDispatch } from '@/hooks';
import { ContextMenuItem } from './ContextMenuStyles';
import { clear } from './actions/clear';
import { useGraph } from '@/hooks/useGraph';

export interface IPaneContextMenu {
  id: string;
  onSelectItem: (item: any) => void;
}

export const PaneContextMenu = ({ id, onSelectItem }: IPaneContextMenu) => {
  const reactFlowInstance = useReactFlow();
  const showGridValue = useSelector(showGrid);
  const snapGridValue = useSelector(snapGrid);
  const dispatch = useDispatch();
  const graph = useGraph();

  const handleTriggerAddNode = useCallback(
    (e) => {
      dispatch.ui.setShowNodesCmdPalette(true);
    },
    [dispatch.ui],
  );

  const recenter = useCallback(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  const setShowGrid = useCallback(() => {
    dispatch.settings.setShowGrid(!showGridValue);
  }, [dispatch.settings, showGridValue]);

  const setSnapGrid = useCallback(() => {
    dispatch.settings.setSnapGrid(!snapGridValue);
  }, [dispatch.settings, snapGridValue]);

  const clearCallback = useCallback(() => {
    clear(reactFlowInstance, graph);
  }, [graph, reactFlowInstance]);

  const layout = useAutoLayout();
  return (
    <Menu id={id}>
      <ContextMenuItem onClick={handleTriggerAddNode}>Add node</ContextMenuItem>
      <ContextMenuItem onClick={layout}>Apply Layout</ContextMenuItem>
      <ContextMenuItem onClick={setShowGrid}>
        {showGridValue ? 'Hide' : 'Show'} Grid
      </ContextMenuItem>
      <ContextMenuItem onClick={recenter}>Recenter</ContextMenuItem>
      <Separator />
      <ContextMenuItem onClick={setSnapGrid}>Snap Grid</ContextMenuItem>
      <Separator />
      <ContextMenuItem onClick={clearCallback}>Clear</ContextMenuItem>
    </Menu>
  );
};
