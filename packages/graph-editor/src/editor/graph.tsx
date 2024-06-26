/* eslint-disable react/display-name */
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
import {
  getNodePositionInsideParent,
  sortNodes,
} from '../components/flow/utils.js';
import { handleDrop } from './actions/handleDrop.js';
import { useDispatch } from '../hooks/index.js';
import { v4 as uuidv4 } from 'uuid';
import CustomEdge from '../components/flow/edges/edge.js';
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactFlow from 'reactflow';

import groupNode from '../components/flow/nodes/groupNode.js';
import noteNode from '../components/flow/nodes/noteNode.js';

import { GraphEditorProps, ImperativeEditorRef } from './editorTypes.js';
import { Box } from '@tokens-studio/ui';
import { BatchRunError, Graph } from '@tokens-studio/graph-engine';
import { useContextMenu } from 'react-contexify';
import { version } from '../../package.json';
import { NodeContextMenu } from '../components/contextMenus/nodeContextMenu.js';
import { EdgeContextMenu } from '../components/contextMenus/edgeContextMenu.js';
import { PaneContextMenu } from '../components/contextMenus/paneContextMenu.js';
import { useSelector } from 'react-redux';
import { connectOnClickSelector, showGrid, showMinimapSelector, snapGrid } from '@/redux/selectors/settings.js';
import { NodeV2 } from '@/components/index.js';
import { CommandMenu } from '@/components/commandPalette/index.js';
import { clear } from './actions/clear.js';
import { copyNodeAction } from './actions/copyNodes.js';
import { deleteNode } from './actions/deleteNode.js';
import { duplicateNodes } from './actions/duplicate.js';
import { PassthroughNode } from '@/components/flow/nodes/passthroughNode.js';
import { uiNodeType, uiVersion, uiViewport, xpos, ypos } from '@/annotations/index.js';
import { connectNodes } from './actions/connect.js';
import { capabilitiesSelector, nodeTypesSelector, panelItemsSelector } from '@/redux/selectors/registry.js';
import { contextMenuSelector } from '@/redux/selectors/ui.js';
import { GraphContextProvider } from '@/context/graph.js';
import { SelectionContextMenu } from '@/components/contextMenus/selectionContextMenu.js';
import { ActionProvider } from './actions/provider.js';
import { HotKeys } from '@/components/hotKeys/index.js';
import { currentPanelIdSelector } from '@/redux/selectors/graph.js';
import { debugInfo } from '@/components/debugger/data.js';
import { NOTE, PASSTHROUGH } from '@/ids.js';
import { useSetCurrentNode } from '@/hooks/useSetCurrentNode.js';
import { useSelectAddedNodes } from '@/hooks/useSelectAddedNodes.js';

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
    const fullNodeLookup = useSelector(nodeTypesSelector);
    const { id, customNodeUI = {}, children } = props;


    const showMinimap = useSelector(showMinimapSelector);
    const capabilities = useSelector(capabilitiesSelector);
    const contextMenus = useSelector(contextMenuSelector);
    const connectOnClick = useSelector(connectOnClickSelector)
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const dispatch = useDispatch();
    const { getIntersectingNodes } = reactFlowInstance;
    const store = useStoreApi();

    const initialGraph: Graph = useMemo(() => new Graph(), []);

    const [graph, setTheGraph] = useState(initialGraph);

    const showGridValue = useSelector(showGrid);
    const snapGridValue = useSelector(snapGrid);
    const internalRef = useRef<ImperativeEditorRef>(null);
    const activeGraphId = useSelector(currentPanelIdSelector);

    const refProxy = useCallback((v) => {
      //@ts-ignore
      if (ref) {
        if (typeof ref === 'function') {
          ref(v);
        }
        else {
          ref.current = v;
        }
      }
      //@ts-ignore
      internalRef.current = v;
      dispatch.graph.registerPanel({ id, panel: { graph, ref: v } });
    }, [dispatch.graph, graph, id, ref])

    //Attach sideeffect listeners
    useEffect(() => {
   
      graph.onFinalize('serialize', (serialized) => {

        const nodes = reactFlowInstance.getNodes();

        const lookup = nodes.reduce((acc, node) => {
          acc[node.id] = node;
          return acc;
        }, {} as Record<string, Node>);

        serialized.nodes.forEach((node) => {

          const flowNode = lookup[node.id];
          if (!flowNode) {
            return;
          }
          node.annotations || (node.annotations = {});
          node.annotations[xpos] = flowNode.position.x;
          node.annotations[ypos] = flowNode.position.y;
        });

        return serialized;

      })

      const valueDetecterDisposer = graph.on('valueSent', (edges) => {
        edges
        const edgeLookup = edges.reduce((acc, edge) => {
          acc[edge.id] = edge;
          return acc;
        }, {});
        const index = Date.now();
        setEdges((edges) => {
          return edges.map((ed) => {
            if (edgeLookup[ed.id]) {
              return {
                ...ed,
                animated: true,
                data: {
                  ...ed.data,
                  animationIndex: index
                }
              };
            }
            return ed;
          });
        });
        setTimeout(() => {
          setEdges((edges) => {
            return edges.map((ed) => {
              //We use the index to ensure that we are only removing the edges that we added
              if (edgeLookup[ed.id] && ed.data?.animationIndex == index) {
                return {
                  ...ed,
                  animated: false,
                  data: {
                    ...(ed.data || {}),
                    animationIndex: undefined
                  }
                };
              }
              return ed;
            });
          });
        }, 400)

      });

      const EdgeUpdaterDisposer = graph.on('edgeIndexUpdated', (edge) => {
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

      const NodeStartDisposer = graph.on('nodeExecuted', (run) => {

        const existing = debugInfo.rows.find(x => x.id == run.node.id);

        if (!existing) {
          debugInfo.addRow({
            id: run.node.id,
            name: run.node.factory.type,
            actions: []
          });
        }

        //Now we need to add the actions
        debugInfo.addAction(run.node.id, {
          id: `${run.node.id}-${Date.now()}`,
          start: run.start,
          end: run.end,
          effectId: 'effect0'
        });

      });

      capabilities.forEach(async (factory) => await graph.registerCapability(factory));


      return () => {
        valueDetecterDisposer();
        EdgeUpdaterDisposer();
        NodeStartDisposer();
      }

    }, [graph])

    const [contextNode, setContextNode] = React.useState<Node[]>([]);
    const [contextEdge, setContextEdge] = React.useState<Edge | null>(null);
    const [dropPanelPosition, setDropPanelPosition] =
      React.useState<XYPosition>({ x: 0, y: 0 });
    const [contextSelection, setContextSelection] = React.useState<Node[]>([]);

    const { show: showPane } = useContextMenu({
      id: props.id + '_pane',
    });
    const { show: showEdge } = useContextMenu({
      id: props.id + '_edge',
    });
    const { show: showSelection } = useContextMenu({
      id: props.id + '_selection',
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

    const handleSelectionContextMenu = useCallback(
      (event, nodes: Node[]) => {
        setContextSelection(nodes);
        showSelection({ event });
      },
      [showSelection],
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
      [PASSTHROUGH]: PassthroughNode,
      [EditorNodeTypes.GROUP]: groupNode,
      [NOTE]: noteNode
    });

    const customNodeMap = useMemo(() => {
      //Turn it into an O(1) lookup object
      return Object.fromEntries(Object.entries(
        {
          ...customNodeUI,
          [NOTE]: NOTE,
          "studio.tokens.generic.preview": "studio.tokens.generic.preview",
        }).map(([k, _]) => [k, k]))
    }, [customNodeUI]);


    const handleDeleteNode = useMemo(() => {
      return deleteNode(graph, dispatch, reactFlowInstance);
    }, [graph, dispatch, reactFlowInstance])

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

          const serialized = graph.serialize();
          //Lazily handle the additional metadata injection
          serialized.annotations[uiViewport] = reactFlowInstance.getViewport();
          serialized.annotations[uiVersion] = version;
          return serialized
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
          let offset = -550;
          const nodes = Object.entries(loadedGraph.nodes).map(([id, node]) => {
            //Generate the react flow nodes
            return {
              id: node.id,
              type: node.annotations[uiNodeType] || 'GenericNode',
              data: {},
              position: {
                x: node.annotations[xpos] || (offset += 550),
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
            return {
              ...edge,
              type: 'custom',
            };
          });

          setNodes(nodes);
          setEdges(edges);

          //Create a finalizer to make sure the positions are updated correctly when saved 


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
        getGraph: () => graph,
        getFlow: () => reactFlowInstance,
      }),
      [reactFlowInstance, fullNodeLookup, dispatch.graph, graph, setNodes, setEdges],
    );

    useSetCurrentNode();

    useEffect(() => {
      if (props.initialGraph) {
        internalRef.current?.loadRaw(props.initialGraph);
      }
    }, [])

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

    const onEdgeDblClick = useCallback(
      (event, clickedEdge) => {
        event.stopPropagation();

        const position = reactFlowInstance?.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = new fullNodeLookup[PASSTHROUGH]({
          graph
        });

        newNode.annotations[uiNodeType] = PASSTHROUGH;
        graph.addNode(newNode);

        const editorNode = {
          id: newNode.id,
          type: PASSTHROUGH,
          data: {},
          position: position || { x: 0, y: 0 },
        } as Node;

        //We need to remove the existing edge 
        graph.removeEdge(clickedEdge.id);

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
        //Create the new edges
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

    const duplicateNodesAction = duplicateNodes({
      graph,
      reactFlowInstance,
      nodeLookup: fullNodeLookup,
    });


    const copyNodes = copyNodeAction(reactFlowInstance, graph, fullNodeLookup);
    const selectAddedNodes = useSelectAddedNodes();

    const onDrop = useCallback(
      async (event) => {
        event.preventDefault();
        const processed = await handleDrop(event);
        //Update the position of the node
        const positionUpdated = processed.map((nodeRequest) => {

          const updatedPosition = nodeRequest.position ? reactFlowInstance.screenToFlowPosition(nodeRequest.position) : undefined;

          return {
            ...nodeRequest,
            position: updatedPosition,
          };
        })


        //Some of the nodes might be invalid, so remember to filter them out
        const newNodes = positionUpdated.map((nodeRequest) => handleSelectNewNodeType(nodeRequest)).filter(x => !!x).map(x => x?.flowNode ?? {} as Node);

        selectAddedNodes(newNodes);

      },
      [handleSelectNewNodeType, reactFlowInstance],
    );
    const nodeCount = nodes.length;
    return (
      <GraphContextProvider graph={graph}>
        <ActionProvider actions={{
          deleteNode: handleDeleteNode,
          createNode: handleSelectNewNodeType,
          duplicateNodes: duplicateNodesAction,
          copyNodes
        }}>

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
            <HotKeys>
              <ReactFlow
                ref={reactFlowWrapper}
                elevateEdgesOnSelect={true}
                nodes={nodes}
                onNodesChange={managedNodesChange}
                onEdgesChange={managedEdgeChange}
                onEdgeDoubleClick={onEdgeDblClick}
                onEdgesDelete={onEdgesDeleted}
                edges={edges}
                connectOnClick={connectOnClick}
                elevateNodesOnSelect={true}
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
                onSelectionContextMenu={contextMenus ? handleSelectionContextMenu : undefined}
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
                {activeGraphId === id && (
                  <CommandMenu
                    items={panelItems}
                    handleSelectNewNodeType={handleSelectNewNodeType}
                  />
                )}
                {props.children}
              </ReactFlow>
            </HotKeys>
          </Box>
          {showMinimap && <MiniMap />}


          <PaneContextMenu
            id={props.id + '_pane'}
            onSelectItem={handleSelectNewNodeType}
          />
          <NodeContextMenu
            id={props.id + '_node'}
            nodes={contextNode}
          />
          <EdgeContextMenu id={props.id + '_edge'} edge={contextEdge} />
          <SelectionContextMenu id={props.id + '_selection'} nodes={contextSelection} />
          {children}
        </ActionProvider>
      </GraphContextProvider>
    );
  },
);
