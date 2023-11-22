import { Edge, useReactFlow } from 'reactflow';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { useDispatch } from '@/hooks/useDispatch.ts';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import copy from 'copy-to-clipboard';
import { LayoutType } from '@/redux/models/settings.ts';
import { useAutoLayout } from './hooks/useAutolayout';
import { useSelector } from 'react-redux';
import { showGrid, snapGrid } from '@/redux/selectors/settings';
import { showNodesPanelSelector } from '@/redux/selectors/ui';

export const keyMap = {
  AUTO_LAYOUT: 'ctrl+alt+f',
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
};

export const useHotkeys = ({ onEdgesDeleted }) => {
  const [showMinimap, setShowMinimap] = useState(true);
  const [hideZoom, setHideZoom] = useState(true);

  const showGridValue = useSelector(showGrid);
  const snapGridValue = useSelector(snapGrid);
  const showNodesPanel = useSelector(showNodesPanelSelector);

  const layout = useAutoLayout();

  const dispatch = useDispatch();

  const reactFlowInstance = useReactFlow();
  const handlers = useMemo(
    () => ({
      AUTO_LAYOUT: layout,
      TOGGLE_HIDE: () => {
        setHideZoom((x) => !x);
      },
      DELETE: (event) => {
        event.preventDefault();

        reactFlowInstance.setNodes((nodes) => nodes.filter((x) => !x.selected));
        reactFlowInstance.setEdges((edges) => {
          const filtered = edges.reduce(
            (acc, edge) => {
              if (edge.selected) {
                acc.removed.push(edge);
              } else {
                acc.remaining.push(edge);
              }
              return acc;
            },
            {
              remaining: [] as Edge[],
              removed: [] as Edge[],
            },
          );

          //Call the side effect
          onEdgesDeleted(filtered.removed);

          return filtered.remaining;
        });
      },
      COPY: (event) => {
        event.stopPropagation();
        event.preventDefault();
        const nodes = reactFlowInstance.getNodes().filter((x) => x.selected);

        const values = {
          nodes,
        };

        copy(JSON.stringify(values, null, 2), {
          debug: true,
          format: 'application/json',
        });
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
        reactFlowInstance.zoomIn({ duration: 300 });
      },
      ZOOM_OUT: (event) => {
        event.preventDefault();
        event.stopPropagation();
        reactFlowInstance.zoomOut({ duration: 300 });
      },
      RESET_ZOOM: () => {
        const existing = reactFlowInstance.getViewport();
        reactFlowInstance.setViewport({ ...existing, zoom: 1 });
      },
      DUPLICATE: (event) => {
        event.preventDefault();
        event.stopPropagation();
        //Get the selected nodes
        const added = reactFlowInstance
          .getNodes()
          .filter((x) => x.selected)
          .filter((x) => {
            switch (x.type) {
              //Should only be one of these
              case NodeTypes.INPUT:
              case NodeTypes.OUTPUT:
                return false;
              default:
                return true;
            }
          })
          .map((x) => {
            const id = uuidv4();

            dispatch.node.duplicate({
              id: x.id,
              newId: id,
            });
            dispatch.input.set({
              id,
              value: {},
            });

            return {
              ...x,
              selected: false,
              position: {
                x: x.position.x,
                y: x.position.y + 100,
              },
              id,
            };
          });

        reactFlowInstance.setNodes((nodes) => [...nodes, ...added]);
      },
      TOGGLE_GRID: (event) => {
        event.preventDefault();
        dispatch.settings.setShowGrid(!showGridValue);
      },
      TOGGLE_MINIMAP: () => {
        setShowMinimap((x) => !x);
      },
      TOGGLE_SNAP_GRID: () => {
        dispatch.settings.setSnapGrid(!snapGridValue);
      },
      TOGGLE_NODES_PANEL: () => {
        dispatch.ui.setShowNodesPanel(!showNodesPanel);
      },
    }),
    [
      dispatch.input,
      dispatch.node,
      dispatch.settings,
      dispatch.ui,
      layout,
      onEdgesDeleted,
      reactFlowInstance,
      showGridValue,
      snapGridValue,
      showNodesPanel,
    ],
  );

  return {
    handlers,
    showMinimap,
    hideZoom,
  };
};
