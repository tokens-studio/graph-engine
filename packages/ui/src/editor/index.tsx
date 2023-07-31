/* eslint-disable react/display-name */
import {
  Background,
  BackgroundVariant,
  Edge,
  EdgeTypes,
  MarkerType,
  Node,
  Panel,
  SelectionMode,
  SnapGrid,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import { ControlsStyled, MiniMapStyled } from '#/components/flow/controls.tsx';
import { NodeTypes as EditorNodeTypes } from '#/components/flow/types.tsx';
import { ForceUpdateProvider } from './forceUpdateContext.tsx';
import { GlobalHotKeys } from 'react-hotkeys';
import {
  getNodePositionInsideParent,
  sortNodes,
} from '#/components/flow/utils.ts';
import { handleDrop } from './fileInput.tsx';
import { keyMap, useHotkeys } from './hotkeys.ts';
import { nodeTypes, stateInitializer } from '#/components/flow/nodes/index.ts';
import { useDispatch } from '#/hooks/index.ts';
import { v4 as uuidv4 } from 'uuid';
import CustomEdge from '#/components/flow/edges/edge.tsx';
import DropPanel from '#/components/flow/dropPanel.tsx';
import React, {
  MouseEvent,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import ReactFlow from 'reactflow';
import SelectedNodesToolbar from '#/components/flow/toolbar/selectedNodesToolbar.tsx';
import groupNode from '#/components/flow/groupNode.tsx';

const snapGridCoords: SnapGrid = [16, 16];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const panOnDrag = [1, 2];

const fullNodeTypes = {
  ...nodeTypes,
  [EditorNodeTypes.GROUP]: groupNode,
};

const edgeTypes = {
  custom: CustomEdge,
} as unknown as EdgeTypes;

const proOptions = {
  account: 'paid-pro',
  hideAttribution: true,
};

const defaultEdgeOptions = {
  style: {
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
};

export interface InitialSet {
  urn: string;
  parentNode: string;
  name: string;
}

type EditorProps = {
  id: string;
  name: string;
};

type EditorState = {
  nodes: Node[];
  edges: Edge[];
};

type ImperativeEditor = {
  /**
   * Clears the editor of all nodes and edges
   * @returns
   */
  clear: () => void;
  save: () => void;
  forceUpdate: () => EditorState;
  load: (state: EditorState) => void;
};

export const Editor = React.forwardRef<ImperativeEditor, EditorProps>(
  (props: EditorProps, ref) => {
    const { id, name } = props;
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const dispatch = useDispatch();
    const { getIntersectingNodes } = reactFlowInstance;
    const store = useStoreApi();
    const [forceUpdate, setForceUpdate] = React.useState(0);

    const onEdgesDeleted = useCallback((edges) => {
      edges.forEach((edge) => {
        dispatch.input.remove({
          id: edge.target,
          key: edge.targetHandle,
        });
      });
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          reactFlowInstance.setNodes([]);
          reactFlowInstance.setEdges([]);

          dispatch.output.set({
            name,
            value: undefined,
          });
        },
        save: () => ({
          nodes: reactFlowInstance.getNodes(),
          edges: reactFlowInstance.getEdges(),
        }),
        forceUpdate: () => {
          setForceUpdate((prev) => prev + 1);
        },
        load: ({ nodes, edges }) => {
          const input = nodes.reduce((acc, node) => {
            acc[node.id] = {};
            return acc;
          }, {});

          dispatch.input.setState(input);

          reactFlowInstance.setNodes(() => nodes);
          reactFlowInstance.setEdges(() => edges);
          //Force delay of 1 tick to allow input state to update
          setTimeout(() => {
            setForceUpdate((prev) => prev + 1);
          }, 1);
        },
      }),
      [reactFlowInstance],
    );

    const onConnect = useCallback((params) => {
      const newEdge = { ...params, id: uuidv4(), type: 'custom' };
      return setEdges((eds) => {
        const newEdgs = eds.reduce(
          (acc, edge) => {
            //All our inputs take a single input only, disconnect if we have a connection already
            if (
              edge.targetHandle == params.targetHandle &&
              edge.target === params.target
            ) {
              return acc;
            }
            acc.push(edge);
            return acc;
          },
          [newEdge] as Edge[],
        );
        return newEdgs;
      });
    }, []);

    const onNodeDragStop = useCallback(
      (_: MouseEvent, node: Node) => {
        if (!node.parentNode) {
          return;
        }

        const intersections = getIntersectingNodes(node).filter(
          (n) => n.type === EditorNodeTypes.GROUP,
        );
        const groupNode = intersections[0];

        // when there is an intersection on drag stop, we want to attach the node to its new parent
        if (intersections.length && node.parentNode !== groupNode?.id) {
          const nextNodes: Node[] = store
            .getState()
            .getNodes()
            .map((n) => {
              if (n.id === groupNode.id) {
                return {
                  ...n,
                  className: '',
                };
              } else if (n.id === node.id) {
                const position = getNodePositionInsideParent(n, groupNode) ?? {
                  x: 0,
                  y: 0,
                };

                return {
                  ...n,
                  position,
                  parentNode: groupNode.id,
                  extent: 'parent' as const,
                };
              }

              return n;
            })
            .sort(sortNodes);

          setNodes(nextNodes);
        }
      },
      [getIntersectingNodes, setNodes, store],
    );

    const onDragOver = useCallback(
      (event) => {
        if (!reactFlowWrapper.current || !reactFlowInstance) {
          return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      },
      [reactFlowInstance],
    );

    const onDrop = useCallback(
      async (event) => {
        event.preventDefault();

        const processed = await handleDrop(event, {
          reactFlowInstance,
          reactFlowWrapper,
          dispatch,
          stateInitializer,
        });

        reactFlowInstance.setNodes((nodes) => [...nodes, ...processed]);
      },
      [reactFlowInstance],
    );

    const onNodeDrag = useCallback(
      (_: MouseEvent, node: Node) => {
        if (!node.parentNode) {
          return;
        }

        const intersections = getIntersectingNodes(node).filter(
          (n) => n.type === EditorNodeTypes.GROUP,
        );
        const groupClassName =
          intersections.length && node.parentNode !== intersections[0]?.id
            ? 'active'
            : '';

        setNodes((nds) => {
          return nds.map((n) => {
            if (n.type === EditorNodeTypes.GROUP) {
              return {
                ...n,
                className: groupClassName,
              };
            } else if (n.id === node.id) {
              return {
                ...n,
                position: node.position,
              };
            }

            return { ...n };
          });
        });
      },
      [getIntersectingNodes, setNodes],
    );

    const { handlers, snapGrid, showGrid, showMinimap } = useHotkeys({
      onEdgesDeleted,
    });

    return (
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges>
        <div
          className="editor"
          style={{ height: '100%' }}
          ref={reactFlowWrapper}
        >
          <ForceUpdateProvider value={forceUpdate}>
            {/* @ts-ignore */}
            <ReactFlow
              fitView
              nodes={nodes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onEdgesDelete={onEdgesDeleted}
              edges={edges}
              elevateNodesOnSelect={false}
              onNodeDragStop={onNodeDragStop}
              snapToGrid={snapGrid}
              edgeTypes={edgeTypes}
              nodeTypes={fullNodeTypes}
              snapGrid={snapGridCoords}
              onNodeDrag={onNodeDrag}
              onConnect={onConnect}
              onDrop={onDrop}
              selectNodesOnDrag={false}
              defaultEdgeOptions={defaultEdgeOptions}
              panOnScroll={true}
              panOnDrag={panOnDrag}
              selectionMode={SelectionMode.Partial}
              onDragOver={onDragOver}
              selectionOnDrag={true}
              minZoom={-Infinity}
              defaultViewport={defaultViewport}
              //This causes weirdness with the minimap
              // onlyRenderVisibleElements={true}
              maxZoom={Infinity}
              proOptions={proOptions}
            >
              <SelectedNodesToolbar />
              <ControlsStyled position="top-right"></ControlsStyled>
              <Panel id="drop-panel" position="top-left">
                <DropPanel />
              </Panel>
              {showMinimap && <MiniMapStyled />}
              {showGrid && (
                <Background
                  color="#aaa"
                  gap={16}
                  variant={BackgroundVariant.Dots}
                />
              )}
            </ReactFlow>
          </ForceUpdateProvider>
        </div>
      </GlobalHotKeys>
    );
  },
);

Editor.whyDidYouRender = true;

export default Editor;
