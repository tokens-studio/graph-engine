import { ContextMenuItem } from './ContextMenuStyles.js';
import { Menu, Separator } from 'react-contexify';
import { clear } from '../../editor/actions/clear.js';
import { showGrid, snapGrid } from '@/redux/selectors/settings.js';
import { useAction } from '@/editor/actions/provider.js';
import { useAutoLayout } from '../../editor/hooks/useAutolayout.js';
import { useDispatch } from '@/hooks/index.js';
import { useLocalGraph } from '@/context/graph.js';
import { useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import useCopyPaste from '@/hooks/useCopyPaste.js';

export interface IPaneContextMenu<T = unknown> {
  id: string;
  onSelectItem: (item: T) => void;
}

export const PaneContextMenu = <T = unknown,>({ id }: IPaneContextMenu<T>) => {
  const reactFlowInstance = useReactFlow();
  const showGridValue = useSelector(showGrid);
  const snapGridValue = useSelector(snapGrid);
  const dispatch = useDispatch();
  const graph = useLocalGraph();
  const createNode = useAction('createNode');
  const { pasteFromClipboard } = useCopyPaste();

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

  const handlePaste = () => {
    pasteFromClipboard();
  };

  const layout = useAutoLayout();
  return (
    <Menu id={id}>
      <ContextMenuItem onClick={handlePaste}>Paste</ContextMenuItem>
      <Separator />
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
