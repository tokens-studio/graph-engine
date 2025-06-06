import { HotKeys as HotKeysComp } from 'react-hotkeys';
import { currentPanelIdSelector } from '@/redux/selectors/graph.js';
import { deleteSelectedNodes } from '@/editor/actions/deleteSelectedNodes.js';
import { focusReactFlowPane } from './utils.js';
import {
  inlineTypes,
  inlineValues,
  showGrid,
  snapGrid,
} from '@/redux/selectors/settings.js';
import { savedViewports } from '@/annotations/index.js';
import { useAction } from '@/editor/actions/provider.js';
import { useAutoLayout } from '@/editor/hooks/useAutolayout.js';
import { useDispatch } from '@/hooks/useDispatch.js';
import { useLocalGraph } from '@/hooks/index.js';
import { useMemo } from 'react';
import { useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/useToast.js';
import React from 'react';
import useCopyPaste from '@/hooks/useCopyPaste.js';

export const keyMap = {
  AUTO_LAYOUT: 'ctrl+alt+f',
  CUT: ['command+x', 'ctrl+x'],
  COPY: ['command+c', 'ctrl+c'],
  PASTE: ['command+v', 'ctrl+v'],
  DELETE: ['delete', 'del', 'backspace'],
  UNDO: ['command+z', 'ctrl+z'],
  REDO: ['command+shift+z', 'ctrl+shift+z'],
  SELECT_ALL: 'ctrl+a',
  DUPLICATE: ['command+d', 'ctrl+d'],
  GROUP: 'ctrl+g',
  UNGROUP: 'ctrl+shift+g',
  SAVE: 'ctrl+s',
  LOAD: 'ctrl+o',
  FIND: 'ctrl+f',
  RESET: 'ctrl+r',
  ZOOM_IN: ['ctrl+plus', 'command+plus'],
  ZOOM_OUT: ['command+-', 'ctrl+-'],
  ZOOM_RESET: 'ctrl+0',
  TOGGLE_GRID: ['command+shift+g', 'ctrl+shift+g'],
  TOGGLE_MINIMAP: ['command+shift+m', 'ctrl+shift+m'],
  TOGGLE_CONTROLS: 'ctrl+shift+c',
  TOGGLE_SIDEBAR: 'ctrl+shift+b',
  TOGGLE_HIDE: 'ctrl+shift+q',
  TOGGLE_FULLSCREEN: 'ctrl+shift+f',
  TOGGLE_HELP: 'ctrl+shift+h',
  TOGGLE_THEME: 'ctrl+shift+t',
  TOGGLE_SNAP_GRID: ['command+shift+s', 'ctrl+shift+s'],
  TOGGLE_NODES_PANEL: ['n'],
  TOGGLE_TYPES: ['t'],
  TOGGLE_VALUES: ['v'],
  SAVE_VIEWPORT: [
    'command+1',
    'command+2',
    'command+3',
    'command+4',
    'command+5',
    'command+6',
    'command+7',
    'command+8',
    'command+9',
    'ctrl+1',
    'ctrl+2',
    'ctrl+3',
    'ctrl+4',
    'ctrl+5',
    'ctrl+6',
    'ctrl+7',
    'ctrl+8',
    'ctrl+9',
  ],
  RECALL_VIEWPORT: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
};

export const getViewports = (graph) => {
  const viewports =
    graph.annotations[savedViewports] || new Array(9).fill(null);
  return (graph.annotations[savedViewports] = viewports);
};

export const useHotkeys = () => {
  const showGridValue = useSelector(showGrid);
  const snapGridValue = useSelector(snapGrid);
  const inlineTypesValue = useSelector(inlineTypes);
  const inlineValuesValue = useSelector(inlineValues);
  const duplicateNodes = useAction('duplicateNodes');
  const deleteNode = useAction('deleteNode');
  const { copySelectedNodes, pasteFromClipboard } = useCopyPaste();
  const layout = useAutoLayout();

  const dispatch = useDispatch();
  const trigger = useToast();

  const graph = useLocalGraph();
  const reactFlowInstance = useReactFlow();

  // create a specific selector for the active ReactFlow instance
  const activeGraphId = useSelector(currentPanelIdSelector);
  const flowSelector = activeGraphId
    ? `#${activeGraphId} .react-flow`
    : '.react-flow';

  const handlers = useMemo(
    () => ({
      SAVE_VIEWPORT: (event) => {
        event.preventDefault();
        if (reactFlowInstance) {
          const currentViewport = reactFlowInstance.getViewport();
          const key = event.key; // Get pressed key (e.g., '1', '2', etc.)
          const viewportIndex = parseInt(key) - 1; // Calculate 0-based index

          if (viewportIndex >= 0 && viewportIndex < 9) {
            const viewports = getViewports(graph);
            viewports[viewportIndex] = currentViewport;
            graph.annotations[savedViewports] = viewports;
            trigger({
              title: 'Viewport saved',
              description: `Viewport ${viewportIndex + 1} saved`,
            });
          }
        }
      },
      RECALL_VIEWPORT: (event) => {
        event.preventDefault();
        const key = event.key;
        const viewportIndex = parseInt(key) - 1;

        if (viewportIndex >= 0 && viewportIndex < 9 && reactFlowInstance) {
          const viewports = getViewports(graph);
          const viewport = viewports[viewportIndex];
          if (!viewport) {
            trigger({
              title: 'Viewport not saved',
              description: `Viewport ${viewportIndex + 1} not saved`,
            });
            return;
          }
          reactFlowInstance.setViewport(viewport);
        }
      },
      AUTO_LAYOUT: layout,
      DELETE: (event) => {
        event.preventDefault();
        deleteSelectedNodes(reactFlowInstance, graph, deleteNode, trigger);
        focusReactFlowPane(flowSelector);
      },
      CUT: (event) => {
        event.stopPropagation();
        event.preventDefault();
        copySelectedNodes();
        deleteSelectedNodes(reactFlowInstance, graph, deleteNode, trigger);
        focusReactFlowPane(flowSelector);
      },
      COPY: (event) => {
        event.stopPropagation();
        event.preventDefault();
        copySelectedNodes();
      },
      PASTE: (event) => {
        event.preventDefault();
        pasteFromClipboard();
        focusReactFlowPane(flowSelector);
      },
      SELECT_ALL: (event) => {
        event.stopPropagation();
        event.preventDefault();
        reactFlowInstance.setNodes((nodes) => {
          return nodes.map((x) => {
            return {
              ...x,
              selected: true,
            };
          });
        });
      },
      ZOOM_IN: (event) => {
        event.stopPropagation();
        event.preventDefault();
        const viewport = reactFlowInstance.getViewport();
        // Don't allow zooming beyond max zoom
        if (viewport.zoom < 10) {
          reactFlowInstance.zoomIn({ duration: 300 });
        }
      },
      ZOOM_OUT: (event) => {
        event.preventDefault();
        event.stopPropagation();
        const viewport = reactFlowInstance.getViewport();
        // Don't allow zooming below min zoom
        if (viewport.zoom > 0.1) {
          reactFlowInstance.zoomOut({ duration: 300 });
        }
      },
      RESET_ZOOM: () => {
        const existing = reactFlowInstance.getViewport();
        reactFlowInstance.setViewport({ ...existing, zoom: 1 });
      },
      DUPLICATE: (event) => {
        event.preventDefault();
        event.stopPropagation();

        const nodeIds = reactFlowInstance
          .getNodes()
          .filter((x) => x.selected)
          .map((x) => x.id);

        duplicateNodes(nodeIds);
      },
      TOGGLE_GRID: (event) => {
        event.preventDefault();
        dispatch.settings.setShowGrid(!showGridValue);
      },
      FIND: (event) => {
        event.preventDefault();
        dispatch.settings.setShowSearch(true);
      },
      TOGGLE_SNAP_GRID: () => {
        dispatch.settings.setSnapGrid(!snapGridValue);
      },
      TOGGLE_TYPES: () => {
        dispatch.settings.setInlineTypes(!inlineTypesValue);
      },
      TOGGLE_VALUES: () => {
        dispatch.settings.setInlineValues(!inlineValuesValue);
      },
    }),

    [
      deleteNode,
      dispatch.settings,
      duplicateNodes,
      graph,
      layout,
      reactFlowInstance,
      flowSelector,
      showGridValue,
      snapGridValue,
      inlineTypesValue,
      inlineValuesValue,
      trigger,
      copySelectedNodes,
      pasteFromClipboard,
    ],
  );

  return handlers;
};

export const HotKeys = ({ children }) => {
  const handlers = useHotkeys();
  return (
    <HotKeysComp
      keyMap={keyMap}
      handlers={handlers}
      allowChanges
      style={{ height: '100%', width: '100%' }}
    >
      {children}
    </HotKeysComp>
  );
};
