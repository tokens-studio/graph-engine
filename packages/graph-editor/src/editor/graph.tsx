/* eslint-disable react/display-name */
// import 'reactflow/dist/style.css';
import { createNode } from './actions/createNode.js';
import {
  Background,
  BackgroundVariant,
  Edge,
  EdgeChange,
  EdgeTypes,
  MiniMap,
  Node,
  NodeChange,
  NodePositionChange,
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
import { keyMap, useHotkeys } from './hooks/hotkeys.ts';

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
  useState,
} from 'react';
import ReactFlow from 'reactflow';
import SelectedNodesToolbar from '../components/flow/toolbar/selectedNodesToolbar.js';
import groupNode from '../components/flow/nodes/groupNode.js';
import noteNode from '../components/flow/nodes/noteNode.js';
import { GraphEditorProps, ImperativeEditorRef } from './editorTypes.ts';
import { Box } from '@tokens-studio/ui';
import { BatchRunError, Graph, NodeFactory, NodeTypes, nodeLookup } from '@tokens-studio/graph-engine';
import { useContextMenu } from 'react-contexify';
import { version } from '../../package.json';
import { NodeContextMenu } from '../components/contextMenus/nodeContextMenu.js';
import { EdgeContextMenu } from '../components/contextMenus/edgeContextMenu.js';
import { PaneContextMenu } from '../components/contextMenus/paneContextMenu.js';
import { useSelector } from 'react-redux';
import { showGrid, snapGrid } from '@/redux/selectors/settings.ts';
import { NodeV2 } from '@/components/index.ts';
import { CommandMenu } from '@/components/commandPalette/index.js';
import { clear } from './actions/clear.ts';
import { copyNodeAction } from './actions/copyNodes.tsx';
import { selectNode } from './actions/selectNode.tsx';
import { deleteNode } from './actions/deleteNode.tsx';
import { PassthroughNode } from '@/components/flow/nodes/passthroughNode.tsx';
import { uiNodeType, uiVersion, uiViewport, xpos, ypos } from '@/annotations/index.ts';
import { connectNodes } from './actions/connect.ts';
import { capabilitiesSelector, panelItemsSelector } from '@/redux/selectors/registry.ts';
import { contextMenuSelector } from '@/redux/selectors/ui.ts';
import { GraphContextProvider } from '@/context/graph.tsx';

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


export const EditorApp = React.forwardRef<ImperativeEditorRef, GraphEditorProps>(
  (props: GraphEditorProps, ref) => {

    const panelItems = useSelector(panelItemsSelector);
    const { id, nodeTypes = {}, customNodeUI = {}, children } = props;


    const fullNodeLookup = useMemo(() => {
      return {
        ...nodeLookup,
        ...nodeTypes,
      } as unknown as Record<string, NodeFactory>;
    }, [nodeTypes]);


    const capabilities = useSelector(capabilitiesSelector);
    const contextMenus = useSelector(contextMenuSelector);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const dispatch = useDispatch();
    const { getIntersectingNodes } = reactFlowInstance;
    const store = useStoreApi();

    const initialGraph = useMemo(() => new Graph(), []);

    const [graph, setTheGraph] = useState(initialGraph);

    const showGridValue = useSelector(showGrid);
    const snapGridValue = useSelector(snapGrid);
    const internalRef = useRef<ImperativeEditorRef>(null);

    const refProxy = useCallback((v) => {
      //@ts-ignore
      ref(v);
      //@ts-ignore
      internalRef.current = v;
      dispatch.graph.registerPanel({ id, panel: { graph, ref: v } });
    }, [dispatch.graph, graph, id, ref])

    //Attach sideeffect listeners
    useMemo(() => {
      capabilities.forEach((factory) => graph.registerCapability(factory));
      graph.on('edgeIndexUpdated', (edge) => {
        setEdges((eds) => {
          return eds.map((ed) => {
            if (ed.id == edge.id) {
              const newEdge = {
                ...ed,
                targetHandle: edge.targetHandle + `[${edge.annotations['engine.index']}]`,
              };

              return newEdge
            }
            return ed;
          });
        });
      });
    }, [graph])

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
    }, [graph]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);


    const managedNodesChange = useCallback((changes: NodeChange[]) => {
      //Note this needs to happen first to clean up ui resources
      onNodesChange(changes);

      //Update annotations 
      changes.forEach(change => {
        //TODO clean this up, this is a mess
        //@ts-ignore
        const id = change.id
        const node = graph.getNode(id);
        if (!node) {
          return;
        }
        switch (change.type) {

          case 'remove':
            graph.removeNode(id);
            break;

          case 'position':
            if ((change as NodePositionChange).position) {
              node.annotations['ui.position.x'] = (change as NodePositionChange).position?.x;
              node.annotations['ui.position.y'] = (change as NodePositionChange).position?.y;
            }
            break;
        }
      });


    }, [graph, onNodesChange]);


    const managedEdgeChange = useCallback((changes: EdgeChange[]) => {
      //TODO , we will want to add onto this at a later point for multiplayer
      onEdgesChange(changes)
    }, [onEdgesChange]);



    // Create flow node types here, instead of the global scope to ensure that custom nodes added by the user are available in nodeTypes
    const fullNodeTypesRef = useRef({
      ...customNodeUI,
      GenericNode: NodeV2,
      [NodeTypes.PASS_THROUGH]: PassthroughNode,
      [EditorNodeTypes.GROUP]: groupNode,
      [NodeTypes.NOTE]: noteNode,
    });

    const customNodeMap = useMemo(() => {
      //Turn it into an O(1) lookup object
      return Object.fromEntries(Object.entries(
        {
          ...customNodeUI,
          [NodeTypes.NOTE]: NodeTypes.NOTE
        }).map(([k, _]) => [k, k]))
    }, [customNodeUI]);


    const handleSelectNode = useMemo(() => {
      return selectNode(dispatch);
    }, [dispatch])

    const handleDeleteNode = useMemo(() => {
      return deleteNode(graph, dispatch);
    }, [graph, dispatch])

    const handleSelectNewNodeType = useMemo(
      () => createNode({
        reactFlowInstance,
        graph,
        nodeLookup: fullNodeLookup,

        customUI: customNodeMap,
        dropPanelPosition,
        dispatch
      }),
      [reactFlowInstance, graph, fullNodeLookup, customNodeMap, dropPanelPosition, dispatch],
    );


    useImperativeHandle(
      refProxy,
      () => ({
        clear: () => {
          clear(reactFlowInstance, graph);
        },
        save: () => {
          //Lazily update the graph annotations
          graph.annotations[uiViewport] = reactFlowInstance.getViewport();
          graph.annotations[uiVersion] = version;
          return graph.serialize();
        },
        loadRaw: (serializedGraph) => {
          if (internalRef.current) {
            internalRef?.current.load(graph.deserialize(serializedGraph, fullNodeLookup));
          }
        },
        load: (loadedGraph: Graph) => {
          //capabilities.forEach(cap => graph.registerCapability(cap));
          //const loadedGraph = graph.deserialize(serializedGraph, fullNodeLookup);
          //Read the annotaions 
          const viewport = loadedGraph.annotations[uiViewport];

          //Might not exist
          if (viewport) {
            reactFlowInstance.setViewport(viewport);
          }
          let offset = -400;
          const nodes = Object.entries(loadedGraph.nodes).map(([id, node]) => {
            //Generate the react flow nodes
            return {
              id: node.id,
              type: node.annotations[uiNodeType] || 'GenericNode',
              data: {},
              position: {
                x: node.annotations[xpos] || (offset += 400),
                y: node.annotations[ypos] || 0,
              },
            } as Node;
          });
          const edges = Object.values(loadedGraph.edges).map((edge) => {
            //This is the only point of difference for the edges
            const indexed = edge.annotations['engine.index'];
            if (indexed !== undefined) {
              return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle + `[${indexed}]`,
                type: 'custom',
              } as Edge;
            }
            return edge;
          });

          setNodes(nodes);
          setEdges(edges);

          dispatch.graph.appendLog({
            type: 'info',
            time: new Date,
            data: {
              msg: `Graph loaded with ${nodes.length} nodes and ${edges.length} edges`
            },
          });
          //Execute the graph once to propagate values and update the UI

          loadedGraph.execute().catch((e: BatchRunError) => {
            dispatch.graph.appendLog({
              type: 'error',
              time: new Date,
              data: {
                node: e.nodeId,
                error: e.message,
                msg: `Error executing graph`
              },
            });
          });

          setTheGraph(loadedGraph);

        },
        getFlow: () => reactFlowInstance,
      }),
      [reactFlowInstance, capabilities, fullNodeLookup, dispatch.graph, graph, setNodes, setEdges],
    );
    0
    const onConnect = useMemo(
      () => connectNodes({ graph, setEdges, dispatch }),
      [dispatch, graph, setEdges],
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
          // handleDeleteNode(node.id);
        });
      },
      [dispatch.graph, graph],
    );

    const onEdgeDblClick = useCallback(
      (event, clickedEdge) => {
        event.stopPropagation();

        const position = reactFlowInstance?.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = new fullNodeLookup[NodeTypes.PASS_THROUGH]({
          graph
        });
        newNode.annotations[uiNodeType] = NodeTypes.PASS_THROUGH;
        graph.addNode(newNode);

        const editorNode = {
          id: newNode.id,
          type: NodeTypes.PASS_THROUGH,
          data: {},
          position: position || { x: 0, y: 0 },
        } as Node;

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

    const copyNodes = copyNodeAction(reactFlowInstance, graph, fullNodeLookup);
    const { handlers } = useHotkeys({
      onEdgesDeleted,
      copyNodes,
      handleDeleteNode,
      graph,
    });



    const onDrop = useCallback(
      async (event) => {
        event.preventDefault();
        const processed = await handleDrop(event);
        //Some of the nodes might be invalid, so remember to filter them out
        const newNodes = processed.map((nodeRequest) => handleSelectNewNodeType(nodeRequest)).filter(x => !!x);

        if (newNodes.length == 1) {
          handleSelectNode(newNodes[0]!.id);
        }
      },
      [handleSelectNewNodeType, handleSelectNode],
    );
    const nodeCount = nodes.length;
    return (
      <GraphContextProvider graph={graph}>
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
            <ReactFlow
              ref={reactFlowWrapper}
              nodes={nodes}
              onNodesChange={managedNodesChange}
              onNodesDelete={onNodesDelete}
              onEdgesChange={managedEdgeChange}
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
              onPaneContextMenu={contextMenus ? handleContextMenu : undefined}
              onEdgeContextMenu={contextMenus ? handleEdgeContextMenu : undefined}
              onNodeContextMenu={contextMenus ? handleNodeContextMenu : undefined}
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
          lookup={fullNodeLookup}
        />
        <EdgeContextMenu id={props.id + '_edge'} edge={contextEdge} />
        {children}
      </GraphContextProvider>
    );
  },
);