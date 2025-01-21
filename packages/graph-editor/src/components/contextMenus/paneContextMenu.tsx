import { ContextMenuItem } from './ContextMenuStyles.js';
import { Menu, Separator } from 'react-contexify';
import { clear } from '../../editor/actions/clear.js';
import { useAction } from '@/editor/actions/provider.js';
import { useAutoLayout } from '../../editor/hooks/useAutolayout.js';
import { useDispatch } from '@/hooks/index.js';
import { useLocalGraph } from '@/context/graph.js';
import { useReactFlow } from 'reactflow';
import { useSystem } from '@/system/hook.js';
import React, { useCallback } from 'react';

export interface IPaneContextMenu<T = unknown> {
  id: string;
  onSelectItem: (item: T) => void;
}

export const PaneContextMenu = <T = unknown,>({ id }: IPaneContextMenu<T>) => {
  const reactFlowInstance = useReactFlow();

  const system = useSystem();
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
    system.settings.setShowGrid(!system.settings.showGrid);
  }, [system.settings]);

  const setSnapGrid = useCallback(() => {
    system.settings.setSnapGrid(!system.settings.snapGrid);
  }, [system.settings]);

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
        {system.settings.showGrid ? 'Hide' : 'Show'} Grid
      </ContextMenuItem>
      <ContextMenuItem onClick={recenter}>Recenter</ContextMenuItem>
      <Separator />
      <ContextMenuItem onClick={setSnapGrid}>Snap Grid</ContextMenuItem>
      <Separator />
      <ContextMenuItem onClick={clearCallback}>Clear</ContextMenuItem>
    </Menu>
  );
};
