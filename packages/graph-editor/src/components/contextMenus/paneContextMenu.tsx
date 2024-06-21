import { ContextMenuItem } from './ContextMenuStyles';
import { Menu, Separator } from 'react-contexify';
import { clear } from '../../editor/actions/clear';
import { showGrid, snapGrid } from '@/redux/selectors/settings';
import { useAction } from '@/editor/actions/provider';
import { useAutoLayout } from '../../editor/hooks/useAutolayout';
import { useDispatch } from '@/hooks';
import { useLocalGraph } from '@/context/graph';
import { useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

export interface IPaneContextMenu {
  id: string;
  onSelectItem: (item: unknown) => void;
}

export const PaneContextMenu = ({ id }: IPaneContextMenu) => {
  const reactFlowInstance = useReactFlow();
  const showGridValue = useSelector(showGrid);
  const snapGridValue = useSelector(snapGrid);
  const dispatch = useDispatch();
  const graph = useLocalGraph();
  const createNode = useAction('createNode');

  const handleTriggerAddNode = useCallback(() => {
    dispatch.ui.setShowNodesCmdPalette(true);
  }, [dispatch.ui]);

  const handleAddNote = useCallback(
    (e) => {
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.triggerEvent.clientX,
        y: e.triggerEvent.clientY,
      });

      const noteNode = {
        type: 'studio.tokens.generic.note',
        position,
        data: {
          text: '',
        },
      };
      createNode(noteNode);
    },
    [reactFlowInstance, createNode],
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
      <ContextMenuItem onClick={handleAddNote}>Add note</ContextMenuItem>
      <Separator />
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
