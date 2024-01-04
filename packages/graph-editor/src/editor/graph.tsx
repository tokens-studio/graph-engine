/* eslint-disable react/display-name */
// import 'reactflow/dist/style.css';
import { createNode } from './actions/createNode.js';
import {
  Background,
  BackgroundVariant,
  Edge,
  EdgeTypes,
  MiniMap,
  Node,
  SelectionMode,
  SnapGrid,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
  XYPosition,
} from 'reactflow';
import { NodeTypes as EditorNodeTypes } from '../components/flow/types.js';
import { GlobalHotKeys } from 'react-hotkeys';
import {
  getNodePositionInsideParent,
  sortNodes,
} from '../components/flow/utils.ts';
import { handleDrop } from './actions/handleDrop.js';
import { keyMap, useHotkeys } from './hotkeys.ts';

import { useDispatch } from '../hooks/index.ts';
import { v4 as uuidv4 } from 'uuid';
import CustomEdge from '../components/flow/edges/edge.js';
import React, {
  MouseEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import ReactFlow from 'reactflow';
import SelectedNodesToolbar from '../components/flow/toolbar/selectedNodesToolbar.js';
import groupNode from '../components/flow/nodes/groupNode.js';
import noteNode from '../components/flow/nodes/noteNode.js';
import { EditorProps, ImperativeEditorRef } from './editorTypes.ts';
import { Box } from '@tokens-studio/ui';
import { Graph, NodeTypes, nodeLookup } from '@tokens-studio/graph-engine';
import { useContextMenu } from 'react-contexify';
import { version } from '../../package.json';
import { NodeContextMenu } from './nodeContextMenu.js';
import { EdgeContextMenu } from './edgeContextMenu.js';
import { PaneContextMenu } from './paneContextMenu.js';
import { useSelector } from 'react-redux';
import { showGrid, snapGrid } from '@/redux/selectors/settings.ts';
import { NodeV2 } from '@/components/index.ts';
import { CommandMenu } from '@/components/commandPalette/index.js';
import { useGraph } from '@/hooks/useGraph.ts';
import { SettingsDialog } from '@/components/dialogs/settings.tsx';
import { clear } from './actions/clear.ts';
import { useRegisterRef } from '@/hooks/useRegisterRef.ts';
import { graphEditorSelector } from '@/redux/selectors/refs.ts';
import { copyNodeAction } from './actions/copyNodes.tsx';
import { stripVariadic } from '@/utils/stripVariadic.ts';

const snapGridCoords: SnapGrid = [16, 16];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const panOnDrag = [1, 3];

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
    const { panelItems, nodeTypes = {}, children } = props;

    const registerRef = useRegisterRef('graphEditor');
    const graphRef = useSelector(
      graphEditorSelector,
    ) as MutableRefObject<ImperativeEditorRef>;

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const dispatch = useDispatch();
    const { getIntersectingNodes } = reactFlowInstance;
    const store = useStoreApi();
    const graph = useGraph();
    const showGridValue = useSelector(showGrid);
    const snapGridValue = useSelector(snapGrid);

    const [contextNode, setContextNode] = React.useState<Node[]>([]);
    const [contextEdge, setContextEdge] = React.useState<Edge | null>(null);
    const [dropPanelPosition, setDropPanelPosition] =
      React.useState<XYPosition>({ x: 0, y: 0 });

    const { show: showPane } = useContextMenu({
      id: props.id + '_pane',
    });
    const { show: showEdge } = useContextMenu({
      id: props.id + '_edge',
    });
    const { show: showNode } = useContextMenu({
      id: props.id + '_node',
    });

    const handleContextMenu = useCallback(
      (event) => {
        setDropPanelPosition({ x: event.clientX, y: event.clientY });
        showPane({ event });
      },
      [showPane],
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

          const position = reactFlowInstance?.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
          dispatch.ui.setNodeInsertPosition(position);

          // TODO: After dropping the node we should try to connect the node if it has 1 handler only
        }
      },
      [dispatch.ui, isHoldingDownOption, reactFlowInstance],
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
        setContextNode([node]);
        showNode({ event });
      },
      [showNode],
    );

    const onEdgesDeleted = useCallback((edges) => {
      edges.forEach((edge) => {
        graph.removeEdge(edge.id);
      });
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Create flow node types here, instead of the global scope to ensure that custom nodes added by the user are available in nodeTypes
    const fullNodeTypesRef = useRef({
      ...nodeTypes,
      GenericNode: NodeV2,
      [EditorNodeTypes.GROUP]: groupNode,
      [EditorNodeTypes.NOTE]: noteNode,
    });

    useImperativeHandle(
      graphRef,
      () => ({
        clear: () => {
          clear(reactFlowInstance, graph);
        },
        save: () => {
          return {
            version,
            viewport: reactFlowInstance.getViewport(),
            nodes: reactFlowInstance.getNodes(),
            edges: reactFlowInstance.getEdges(),
            graph: graph.serialize(),
          };
        },
        load: ({ nodes, edges, graph: serializedGraph }) => {
          dispatch.graph.setGraph(
            Graph.deserialize(serializedGraph, nodeLookup),
          );

          reactFlowInstance.setNodes(() => nodes);
          reactFlowInstance.setEdges(() => edges);
          //Force delay of 1 tick to allow input state to update
        },
        getFlow: () => reactFlowInstance,
      }),
      [reactFlowInstance, graph, dispatch.graph],
    );

    const onConnect = useCallback(
      (params) => {
        //Create the connection in the underlying graph

        let parameters = params;
        const sourceNode = graph.getNode(params.source);
        const targetNode = graph.getNode(params.target);
        if (!sourceNode || !targetNode) {
          throw new Error('Could not find node');
        }

        const sourcePort =
          sourceNode.outputs[stripVariadic(params.sourceHandle)];
        const targetPort =
          targetNode.inputs[stripVariadic(params.targetHandle)];

        const newGraphEdge = graph.connect(
          sourceNode,
          sourcePort,
          targetNode,
          targetPort,
        );

        let addData: any = undefined;

        //If the target port is variadic, we need to add the index to the edge data
        if (targetPort.variadic) {
          addData = {
            index: newGraphEdge.data.index,
          };
          parameters = {
            ...parameters,
            targetHandle: params.targetHandle + `[${newGraphEdge.data.index}]`,
          };
        }

        const newEdge = {
          ...parameters,
          id: newGraphEdge.id,
          type: 'custom',
          data: addData,
        };

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
      },
      [graph, setEdges],
    );

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

    const onNodesDelete = useCallback(
      (nodes: Node[]) => {
        nodes.forEach((node) => {
          graph.removeNode(node.id);
        });
      },
      [graph],
    );

    const onEdgeDblClick = useCallback(
      (event, clickedEdge) => {
        event.stopPropagation();

        const position = reactFlowInstance?.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = new nodeLookup[NodeTypes.PASS_THROUGH]();
        graph.addNode(newNode);

        const editorNode = {
          id: newNode.id,
          type: 'GenericNode',
          data: {},
          position: position || { x: 0, y: 0 },
        };

        const aEdge = {
          id: uuidv4(),
          source: clickedEdge.source,
          target: newNode.id,
          sourceHandle: clickedEdge.sourceHandle,
          targetHandle: 'value',
        };
        const bEdge = {
          id: uuidv4(),
          source: newNode.id,
          sourceHandle: 'value',
          target: clickedEdge.target,
          targetHandle: clickedEdge.targetHandle,
        };
        //Create the edges
        graph.createEdge(aEdge);
        graph.createEdge(bEdge);

        graph.update(newNode.id);
        setNodes((nds) => [...nds, editorNode]);

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
            ...aEdge,
            type: 'custom',
          };
          //Create another edge from the new node to the old target
          const newEdge2 = {
            ...bEdge,
            type: 'custom',
          };

          return [...filtered, newEdge, newEdge2];
        });
      },
      [graph, reactFlowInstance, setEdges, setNodes],
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

    const copyNodes = copyNodeAction(reactFlowInstance, graph, nodeLookup);
    const { handlers } = useHotkeys({
      onEdgesDeleted,
      copyNodes,
      graph,
    });

    const handleSelectNewNodeType = useMemo(
      () => createNode(reactFlowInstance, graph, nodeLookup, dropPanelPosition),
      [reactFlowInstance, graph, dropPanelPosition],
    );

    const onDrop = useCallback(
      async (event) => {
        event.preventDefault();
        const processed = await handleDrop(event);
        processed.forEach((nodeRequest) => {
          handleSelectNewNodeType(nodeRequest);
        });
      },
      [handleSelectNewNodeType],
    );
    const nodeCount = nodes.length;
    return (
      <>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges>
          <Box
            ref={registerRef}
            className="editor"
            css={{
              height: '100%',
              backgroundColor: '$bgCanvas',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
            }}
          >
            <Box
              css={{
                position: 'absolute',
                zIndex: 500,
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Box
                css={{
                  position: 'relative',
                  padding: '$3',
                  zIndex: 600,
                }}
              >
                <SettingsDialog />
              </Box>
            </Box>
            <ReactFlow
              ref={reactFlowWrapper}
              nodes={nodes}
              onNodesChange={onNodesChange}
              onNodesDelete={onNodesDelete}
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
              selectNodesOnDrag={true}
              defaultEdgeOptions={defaultEdgeOptions}
              panOnScroll={true}
              //Note that we cannot use pan on drag or it will affect the context menu
              onPaneContextMenu={handleContextMenu}
              // onEdgeContextMenu={handleEdgeContextMenu}
              // onNodeContextMenu={handleNodeContextMenu}
              selectionMode={SelectionMode.Partial}
              onDragOver={onDragOver}
              selectionOnDrag={true}
              panOnDrag={panOnDrag}
              minZoom={-Infinity}
              zoomOnDoubleClick={false}
              defaultViewport={defaultViewport}
              onlyRenderVisibleElements={true}
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
              <CommandMenu
                reactFlowWrapper={reactFlowWrapper}
                items={panelItems}
                handleSelectNewNodeType={handleSelectNewNodeType}
              />
              {props.children}
            </ReactFlow>
          </Box>
          <MiniMap />
        </GlobalHotKeys>
        <PaneContextMenu
          id={props.id + '_pane'}
          onSelectItem={handleSelectNewNodeType}
        />
        <NodeContextMenu
          id={props.id + '_node'}
          nodes={contextNode}
          graph={graph}
          lookup={nodeLookup}
        />
        <EdgeContextMenu id={props.id + '_edge'} edge={contextEdge} />
        {children}
      </>
    );
  },
);
