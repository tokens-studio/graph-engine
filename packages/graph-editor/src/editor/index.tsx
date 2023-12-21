/* eslint-disable react/display-name */
// import 'reactflow/dist/style.css';
import '../index.css';

import {
  Background,
  BackgroundVariant,
  Edge,
  EdgeTypes,
  MarkerType,
  Node,
  SelectionMode,
  SnapGrid,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
  ReactFlowProvider,
  XYPosition,
} from 'reactflow';
import { CustomControls } from '../components/flow/controls.tsx';
import { NodeTypes as EditorNodeTypes } from '../components/flow/types.tsx';
import { ForceUpdateProvider } from './forceUpdateContext.tsx';
import { GlobalHotKeys } from 'react-hotkeys';
import {
  getNodePositionInsideParent,
  sortNodes,
} from '../components/flow/utils.ts';
import { handleDrop } from './fileInput.tsx';
import { keyMap, useHotkeys } from './hotkeys.ts';
import {
  defaultNodeTypes,
  defaultStateInitializer,
} from '../components/flow/nodes/index.ts';
import { useDispatch } from '../hooks/index.ts';
import { v4 as uuidv4 } from 'uuid';
import CustomEdge from '../components/flow/edges/edge.tsx';
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import ReactFlow from 'reactflow';
import { ReduxProvider } from '../redux/index.tsx';
import SelectedNodesToolbar from '../components/flow/toolbar/selectedNodesToolbar.tsx';
import groupNode from '../components/flow/groupNode.tsx';
import { EditorProps, ImperativeEditorRef } from './editorTypes.ts';
import { Box, IconButton, Stack, Tooltip } from '@tokens-studio/ui';
import { OnOutputChangeContextProvider } from '#/context/OutputContext.tsx';
import { createNode } from './create.ts';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { useContextMenu } from 'react-contexify';
import { version } from '../../package.json';
import { NodeContextMenu } from './nodeContextMenu.tsx';
import { EdgeContextMenu } from './edgeContextMenu.tsx';
import { PaneContextMenu } from './paneContextMenu.tsx';
import { useSelector } from 'react-redux';
import { showGrid, snapGrid } from '#/redux/selectors/settings.ts';
import { showNodesPanelSelector } from '#/redux/selectors/ui.ts';
import { forceUpdate } from '#/redux/selectors/graph.ts';
import { DropPanel } from '#/components/index.ts';
import { CommandMenu } from '#/components/CommandPalette.tsx';
import { ExternalLoaderProvider } from '#/context/ExternalLoaderContext.tsx';
import { defaultPanelItems } from '#/components/flow/DropPanel/PanelItems.tsx';
import { Settings } from '#/components/Settings.tsx';

const snapGridCoords: SnapGrid = [16, 16];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const panOnDrag = [1, 2];

const noop = () => {};

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
};

export const EditorApp = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {
    const {
      showMenu = true,
      panelItems = defaultPanelItems,
      nodeTypes = defaultNodeTypes,
      stateInitializer = defaultStateInitializer,
    } = props;

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const dispatch = useDispatch();
    const { getIntersectingNodes } = reactFlowInstance;
    const store = useStoreApi();
    const showGridValue = useSelector(showGrid);
    const snapGridValue = useSelector(snapGrid);
    const showNodesPanel = useSelector(showNodesPanelSelector);
    const forceUpdateValue = useSelector(forceUpdate);

    React.useEffect(() => {
      if (!!props.shouldShowNodesPanel)
        dispatch.ui.setShowNodesPanel(props.shouldShowNodesPanel);
    }, [props.shouldShowNodesPanel]);

    React.useEffect(() => {
      if (typeof props.onShowNodesPanelChange === 'function') {
        props.onShowNodesPanelChange(showNodesPanel);
      }
    }, [showNodesPanel]);

    const [contextNode, setContextNode] = React.useState<Node | null>(null);
    const [contextEdge, setContextEdge] = React.useState<Edge | null>(null);
    const [dropPanelPosition, setDropPanelPosition] =
      React.useState<XYPosition>({ x: 0, y: 0 });

    const { show } = useContextMenu({
      id: props.id + '_pane',
    });
    const { show: showEdge } = useContextMenu({
      id: props.id + '_edge',
    });
    const { show: showNode } = useContextMenu({
      id: props.id + '_node',
    });
    // const { show: showPicker } = useContextMenu({
    //   id: props.id + '_picker',
    // });

    const handleContextMenu = useCallback(
      (event) => {
        setDropPanelPosition({ x: event.clientX, y: event.clientY });
        show({ event });
      },
      [show],
    );

    const [isHoldingDownOption, setIsHoldingDownOption] = React.useState(false);

    useEffect(() => {
      const down = (e) => {
        if (e.altKey) {
          e.preventDefault();

          setIsHoldingDownOption(true);
        } else {
          setIsHoldingDownOption(false);
        }
      };

      document.addEventListener('keydown', down);
      return () => document.removeEventListener('keydown', down);
    }, [dispatch.ui]);

    const onConnectEnd = useCallback(
      (event) => {
        if (!isHoldingDownOption) {
          return;
        }

        const targetIsPane =
          event.target.classList.contains('react-flow__pane');

        if (targetIsPane) {
          dispatch.ui.setShowNodesCmdPalette(true);

          const reactFlowBounds =
            reactFlowWrapper?.current?.getBoundingClientRect();
          if (!reactFlowBounds) {
            return;
          }
          const position = reactFlowInstance?.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });
          dispatch.ui.setNodeInsertPosition(position);

          // TODO: After dropping the node we should try to connect the node if it has 1 handler only
        }
      },
      [dispatch.ui, isHoldingDownOption, reactFlowInstance, reactFlowWrapper],
    );

    const handleEdgeContextMenu = useCallback(
      (event, edge) => {
        setContextEdge(edge);
        showEdge({ event });
      },
      [showEdge],
    );

    const handleNodeContextMenu = useCallback(
      (event, node) => {
        setContextNode(node);
        showNode({ event });
      },
      [showNode],
    );

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

    const nodeState = dispatch.node.getState();

    // Create flow node types here, instead of the global scope to ensure that custom nodes added by the user are available in nodeTypes
    const fullNodeTypesRef = useRef({
      ...nodeTypes,
      [EditorNodeTypes.GROUP]: groupNode,
    });

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          reactFlowInstance.setNodes([]);
          reactFlowInstance.setEdges([]);
        },
        save: () => ({
          graph: {
            version,
          },
          viewport: reactFlowInstance.getViewport(),
          nodes: reactFlowInstance.getNodes(),
          edges: reactFlowInstance.getEdges(),
          nodeState,
        }),
        forceUpdate: () => {
          dispatch.graph.forceNewUpdate();
        },
        load: ({ nodes, edges, nodeState }) => {
          const input = nodes.reduce((acc, node) => {
            acc[node.id] = {};
            return acc;
          }, {});

          dispatch.input.setState(input);
          dispatch.node.setState(nodeState);

          reactFlowInstance.setNodes(() => nodes);
          reactFlowInstance.setEdges(() => edges);
          //Force delay of 1 tick to allow input state to update
          setTimeout(() => {
            dispatch.graph.forceNewUpdate();
          }, 1);
        },
        getFlow: () => reactFlowInstance,
      }),
      [
        reactFlowInstance,
        nodeState,
        dispatch.graph,
        dispatch.input,
        dispatch.node,
      ],
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
      [dispatch, reactFlowInstance, stateInitializer],
    );

    const onEdgeDblClick = useCallback(
      (event, clickedEdge) => {
        event.stopPropagation();

        const reactFlowBounds =
          reactFlowWrapper!.current!.getBoundingClientRect();

        const position = reactFlowInstance?.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode = createNode({
          nodeRequest: {
            type: NodeTypes.PASS_THROUGH,
          },
          stateInitializer,
          dispatch,
          position,
        });

        //Set the initial value
        dispatch.input.copyInputKey({
          id: newNode.id,
          key: 'input',
          source: clickedEdge.target,
          sourceKey: clickedEdge.targetHandle,
        });

        setEdges((eds) => {
          //Remove the old edge
          const filtered = eds.filter((edge) => {
            return !(
              edge.target == clickedEdge.target &&
              edge.targetHandle == clickedEdge.targetHandle
            );
          });
          //Add a new edge from the old target to the new node
          const newEdge = {
            source: clickedEdge.source,
            sourceHandle: clickedEdge.sourceHandle,
            target: newNode.id,
            targetHandle: 'input',
            id: uuidv4(),
            type: 'custom',
          };
          //Create another edge from the new node to the old target
          const newEdge2 = {
            source: newNode.id,
            sourceHandle: 'output',
            target: clickedEdge.target,
            targetHandle: clickedEdge.targetHandle,
            id: uuidv4(),
            type: 'custom',
          };

          return [...filtered, newEdge, newEdge2];
        });

        //Create a proxy node
        setNodes((nds) => [...nds, newNode]);
      },
      [dispatch, reactFlowInstance, setEdges, setNodes],
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

    const { handlers } = useHotkeys({
      onEdgesDeleted,
    });

    const handleSelectNewNodeType = async (nodeRequest) => {
      const dropPosition = nodeRequest.position || {
        x: dropPanelPosition.x,
        y: dropPanelPosition.y,
      };
      const nodes = reactFlowInstance.getNodes();
      // Couldn't determine the type
      if (!nodeRequest.type) {
        return;
      }
      if (
        nodeRequest.type == NodeTypes.INPUT &&
        nodes.some((x) => x.type == NodeTypes.INPUT)
      ) {
        alert('Only one input node allowed');
        return null;
      }
      if (
        nodeRequest.type == NodeTypes.OUTPUT &&
        nodes.some((x) => x.type == NodeTypes.OUTPUT)
      ) {
        alert('Only one output node allowed');
        return null;
      }
      // set x y coordinates in instance
      const position = reactFlowInstance.project(dropPosition);
      const newNode = createNode({
        nodeRequest,
        stateInitializer,
        dispatch,
        position,
      });
      reactFlowInstance.addNodes(newNode);
    };

    const nodeCount = nodes.length;

    return (
      <>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges>
          <Box
            className="editor"
            css={{
              height: '100%',
              backgroundColor: '$bgCanvas',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
            }}
          >
            <ForceUpdateProvider value={forceUpdate}>
              <Box
                css={{
                  position: 'absolute',
                  zIndex: 500,
                  display: 'flex',
                  flexDirection: 'row',
                  height: 'inherit',
                }}
              >
                {showMenu && (
                  <Stack
                    direction="column"
                    gap={2}
                    css={{
                      position: 'relative',
                      padding: '$3',
                      paddingRight: 0,
                      zIndex: 600,
                    }}
                  >
                    {props.menuContent}
                    <Settings />
                  </Stack>
                )}
                {showNodesPanel && (
                  <Box
                    css={{
                      paddingLeft: '$3',
                      paddingTop: '$3',
                      paddingBottom: '$3',
                    }}
                  >
                    <Box
                      css={{
                        backgroundColor: '$bgDefault',
                        width: 'var(--globals-drop-panel-width)',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid $borderSubtle',
                        boxShadow: '$small',
                        borderRadius: '$medium',
                        overflowY: 'auto',
                        maxHeight: '100%',
                      }}
                    >
                      <DropPanel groups={[]} items={panelItems} />
                    </Box>
                  </Box>
                )}
              </Box>
              <ReactFlow
                ref={reactFlowWrapper}
                fitView
                nodes={nodes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgeDoubleClick={onEdgeDblClick}
                onEdgesDelete={onEdgesDeleted}
                edges={edges}
                elevateNodesOnSelect={false}
                onNodeDragStop={onNodeDragStop}
                snapToGrid={snapGridValue}
                edgeTypes={edgeTypes}
                nodeTypes={fullNodeTypesRef.current}
                snapGrid={snapGridCoords}
                onNodeDrag={onNodeDrag}
                onConnect={onConnect}
                onDrop={onDrop}
                onConnectEnd={onConnectEnd}
                selectNodesOnDrag={false}
                defaultEdgeOptions={defaultEdgeOptions}
                panOnScroll={true}
                //Note that we cannot use pan on drag or it will affect the context menu
                onPaneContextMenu={handleContextMenu}
                onEdgeContextMenu={handleEdgeContextMenu}
                onNodeContextMenu={handleNodeContextMenu}
                selectionMode={SelectionMode.Partial}
                onDragOver={onDragOver}
                selectionOnDrag={true}
                panOnDrag={panOnDrag}
                minZoom={-Infinity}
                zoomOnDoubleClick={false}
                defaultViewport={defaultViewport}
                //This causes weirdness with the minimap
                // onlyRenderVisibleElements={true}
                maxZoom={Infinity}
                proOptions={proOptions}
              >
                {showGridValue && (
                  <Background
                    color="var(--colors-borderMuted)"
                    gap={16}
                    size={2}
                    variant={BackgroundVariant.Dots}
                  />
                )}
                {nodeCount === 0 && props.emptyContent}
                <SelectedNodesToolbar />
                <CustomControls position="bottom-center" />
                <CommandMenu
                  reactFlowWrapper={reactFlowWrapper}
                  items={panelItems}
                  handleSelectNewNodeType={handleSelectNewNodeType}
                />
                {props.children}
              </ReactFlow>
            </ForceUpdateProvider>
          </Box>
        </GlobalHotKeys>
        <PaneContextMenu
          id={props.id + '_pane'}
          onSelectItem={handleSelectNewNodeType}
        />
        <NodeContextMenu id={props.id + '_node'} node={contextNode} />
        <EdgeContextMenu id={props.id + '_edge'} edge={contextEdge} />
      </>
    );
  },
);

export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {
    const { onOutputChange, externalLoader } = props;
    return (
      <ReduxProvider>
        <ReactFlowProvider>
          <OnOutputChangeContextProvider
            onOutputChange={onOutputChange || noop}
          >
            <ExternalLoaderProvider externalLoader={externalLoader}>
              <Tooltip.Provider>
                <EditorApp {...props} ref={ref} />
              </Tooltip.Provider>
            </ExternalLoaderProvider>
          </OnOutputChangeContextProvider>
        </ReactFlowProvider>
      </ReduxProvider>
    );
  },
);
