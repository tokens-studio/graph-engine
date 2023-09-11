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
import { nodeTypes, stateInitializer } from '../components/flow/nodes/index.ts';
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
import { Box, Button, EmptyState, IconButton, Stack, Tooltip } from '@tokens-studio/ui';
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
import { BatteryChargingIcon, FilePlusIcon } from '@iconicicons/react';
import { AppsIcon } from '#/components/icons/AppsIcon.tsx';

const snapGridCoords: SnapGrid = [16, 16];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

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

export const EditorApp = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const dispatch = useDispatch();
    const { getIntersectingNodes } = reactFlowInstance;
    const store = useStoreApi();
    const showGridValue = useSelector(showGrid);
    const snapGridValue = useSelector(snapGrid);
    const showNodesPanel = useSelector(showNodesPanelSelector);
    const forceUpdateValue = useSelector(forceUpdate);

    const handleTogglePanel = () => {
      dispatch.ui.setShowNodesPanel(!showNodesPanel);
    };

    const [contextNode, setContextNode] = React.useState<Node | null>(null);
    const [contextEdge, setContextEdge] = React.useState<Edge | null>(null);
    const [dropPanelPosition, setDropPanelPosition] =
      React.useState<XYPosition>({ x: 0, y: 0 });

    const { show } = useContextMenu({
      id: props.id + '_pane'
    });
    const { show: showEdge } = useContextMenu({
      id: props.id + '_edge',
    });
    const { show: showNode } = useContextMenu({
      id: props.id + '_node',
    });
    const { show: showPicker } = useContextMenu({
      id: props.id + '_picker',
    });

    const handleContextMenu = useCallback(
      (event) => {
        console.log("Event is", event);
        setDropPanelPosition({ x: event.clientX, y: event.clientY });
        
        show({ event });
      },
      [show],
    );

    const onConnectEnd = useCallback(
      (event) => {
        // Commenting out for now, I'd like to bring this back once we have cmdk hooked up, I'd do this after we merge this PR.
        // I imagine the user being able to do what they can in Figma with Shift + I
        // which triggers a combobox to select the node type. I expect that same combobox (in a cmd palette)
        // to also appear when I drag a node, hold option (alt) and then let go in the canvas - I'd expect to be able to select a new node type (and if its just 1 input, connect it)
        // const targetIsPane =
        //   event.target.classList.contains('react-flow__pane');

        // if (targetIsPane) {          
        //   showPicker({ event });
        //   const reactFlowBounds =
        //     reactFlowWrapper?.current?.getBoundingClientRect();
        //   if (!reactFlowBounds) {
        //     return;
        //   }
        //   const position = reactFlowInstance?.project({
        //     x: event.clientX - reactFlowBounds.left,
        //     y: event.clientY - reactFlowBounds.top,
        //   });
        //   setDropPanelPosition(position);
        // }
      },
      [reactFlowInstance, showPicker],
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
      [reactFlowInstance],
    );

    const onEdgeDblClick = useCallback((event, clickedEdge) => {
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
    }, []);

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

    const { handlers, showMinimap } = useHotkeys({
      onEdgesDeleted,
    });

    const handleSelectNewNodeType = (nodeRequest) => {
      console.log('nodeRequest', nodeRequest);

      const dropPosition = nodeRequest.position || {
        x: dropPanelPosition.x,
        y: dropPanelPosition.y,
      }
      
      const nodes = reactFlowInstance.getNodes();

      console.log('nodes', nodes);
      
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


      console.log('reactFlowInstance', reactFlowInstance.viewportInitialized);

      // set x y coordinates in instance
      const position = reactFlowInstance.project(dropPosition);

      console.log('position', position);

      const newNode = createNode({
        nodeRequest,
        stateInitializer,
        dispatch,
        position,
      })

      reactFlowInstance.addNodes(newNode);
    };
    
    const nodeCount = nodes.length;

    return (
      <>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges>
          <Box
            className="editor"
            css={{ height: '100%', backgroundColor: '$bgCanvas', display: 'flex', flexDirection: 'row', flexGrow: 1 }}
          >
            <ForceUpdateProvider value={forceUpdate}>
              <Box css={{ display: 'flex', flexDirection: 'row' }}>
                <Stack direction="column" gap={2} css={{ position: 'relative', backgroundColor: '$bgDefault', padding: '$1', borderRight: '1px solid $borderSubtle' }}>
                  <IconButton tooltip='Add nodes (n)' onClick={handleTogglePanel} icon={<AppsIcon />} variant={showNodesPanel ? 'primary' : 'invisible'} />
                  {props.menuContent}
                </Stack>
                {showNodesPanel && <Box css={{ backgroundColor: '$bgDefault', width: '240px', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRight: '1px solid $borderMuted', zIndex: 10 }}>
                  <DropPanel />
                </Box>}
              </Box>
              {/* @ts-ignore */}
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
                nodeTypes={fullNodeTypes}
                snapGrid={snapGridCoords}
                onNodeDrag={onNodeDrag}
                onConnect={onConnect}
                onDrop={onDrop}
                onConnectEnd={onConnectEnd}
                selectNodesOnDrag={false}
                defaultEdgeOptions={defaultEdgeOptions}
                panOnScroll={true}
                // panOnDrag={panOnDrag}
                onPaneContextMenu={handleContextMenu}
                onEdgeContextMenu={handleEdgeContextMenu}
                onNodeContextMenu={handleNodeContextMenu}
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
            
                {showGridValue && (
                  <Background
                    color="var(--colors-borderMuted)"
                    gap={16}
                    size={2}
                    variant={BackgroundVariant.Dots}
                  />
                )}
                    {nodeCount === 0 && (
                  <Box css={{display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', width: '100%', height: '100%', position: 'relative', zIndex: 100}}>
                    <EmptyState icon={<BatteryChargingIcon style={{width: 48, height: 48 }} />} title="Build scalable and flexible design systems." description='Add your first node to get started or load an example' /></Box>                 
                )}
                <SelectedNodesToolbar />
                <CustomControls position="bottom-center" />
              </ReactFlow>
            </ForceUpdateProvider>
          </Box>
        </GlobalHotKeys>
        <PaneContextMenu id={props.id + '_pane'}  onSelectItem={handleSelectNewNodeType}/>
        <NodeContextMenu id={props.id + '_node'} node={contextNode} />
        <EdgeContextMenu id={props.id + '_edge'} edge={contextEdge} />
      </>
    );
  },
);

export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {
    const { onOutputChange } = props;
    return (
      <ReduxProvider>
        <ReactFlowProvider>
          <OnOutputChangeContextProvider onOutputChange={onOutputChange}>
            <Tooltip.Provider>
              <EditorApp {...props} ref={ref} />
            </Tooltip.Provider>
          </OnOutputChangeContextProvider>
        </ReactFlowProvider>
      </ReduxProvider>
    );
  },
);
