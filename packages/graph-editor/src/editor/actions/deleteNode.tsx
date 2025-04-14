import { Dispatch, store } from '@/redux/store.js';
import {
  Graph,
  ISubgraphContainer,
  Node,
  isSubgraphContainer,
} from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';
import type { DockLayout, TabData } from 'rc-dock';
import type { MutableRefObject } from 'react';

function removeInnerGraphTabs(
  node: Node & ISubgraphContainer,
  dispatch: Dispatch,
): void {
  const state = store.getState();
  const dockerRef = state?.refs?.docker as
    | MutableRefObject<DockLayout>
    | undefined;

  if (!dockerRef?.current) return;

  const innerGraphs = node.getSubgraphs();
  for (const innerGraph of innerGraphs) {
    if (!innerGraph?.annotations) continue;

    const graphId = innerGraph.annotations?.['engine.id'];
    if (typeof graphId !== 'string') continue;

    try {
      const existing = dockerRef.current.find(graphId) as TabData | null;
      if (existing) {
        dockerRef.current.dockMove(existing, null, 'remove');
      }
    } catch (error) {
      dispatch.graph.appendLog({
        type: 'error',
        time: new Date(),
        data: {
          msg: `Error removing tab for graph ${graphId}`,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
}

function removeNodeFromGraph(
  graph: Graph,
  id: string,
  dispatch: Dispatch,
): void {
  try {
    graph.removeNode(id);
  } catch (error) {
    dispatch.graph.appendLog({
      type: 'error',
      time: new Date(),
      data: {
        msg: `Error removing node ${id}`,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

function removeReactFlowElements(
  reactFlowInstance: ReactFlowInstance,
  id: string,
  inEdges: Array<{ id: string }>,
  outEdges: Array<{ id: string }>,
  dispatch: Dispatch,
): void {
  try {
    reactFlowInstance.deleteElements({
      nodes: [{ id }],
      edges: inEdges.concat(outEdges).map((edge) => ({ id: edge.id })),
    });
  } catch (error) {
    dispatch.graph.appendLog({
      type: 'error',
      time: new Date(),
      data: {
        msg: `Error deleting ReactFlow elements for node ${id}`,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export const deleteNode = (
  graph: Graph,
  dispatch: Dispatch,
  reactFlowInstance: ReactFlowInstance,
) => {
  return (id: string) => {
    const inEdges = graph.inEdges(id);
    const outEdges = graph.outEdges(id);
    const node = graph.getNode(id);

    if (node && isSubgraphContainer(node)) {
      removeInnerGraphTabs(node, dispatch);
    }

    removeNodeFromGraph(graph, id, dispatch);
    dispatch.graph.checkClearSelectedNode(id);
    removeReactFlowElements(reactFlowInstance, id, inEdges, outEdges, dispatch);
  };
};
