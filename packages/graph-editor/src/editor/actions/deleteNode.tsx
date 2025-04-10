import { Dispatch, store } from '@/redux/store.js';
import { Graph } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';
import type { DockLayout, TabData } from 'rc-dock';
import type { MutableRefObject } from 'react';

interface NodeWithInnerGraph {
  _innerGraph: {
    annotations?: Record<string, unknown>;
  };
}

function hasInnerGraph(node: unknown): node is NodeWithInnerGraph {
  return Boolean(
    node &&
      typeof node === 'object' &&
      node !== null &&
      '_innerGraph' in node &&
      node._innerGraph &&
      typeof node._innerGraph === 'object',
  );
}

function removeInnerGraphTabs(node: NodeWithInnerGraph): void {
  const state = store.getState();
  const dockerRef = state?.refs?.docker as
    | MutableRefObject<DockLayout>
    | undefined;

  if (!dockerRef?.current) return;

  const innerGraph = node._innerGraph;
  if (!innerGraph?.annotations) return;

  const graphId = innerGraph.annotations?.['engine.id'];
  if (typeof graphId !== 'string') return;

  try {
    const existing = dockerRef.current.find(graphId) as TabData | null;
    if (existing) {
      dockerRef.current.dockMove(existing, null, 'remove');
    }
  } catch (error) {
    console.error(`Error removing tab for graph ${graphId}:`, error);
  }
}

function removeNodeFromGraph(graph: Graph, id: string): void {
  try {
    graph.removeNode(id);
  } catch (error) {
    console.error(`Error removing node ${id}:`, error);
  }
}

function removeReactFlowElements(
  reactFlowInstance: ReactFlowInstance,
  id: string,
  inEdges: Array<{ id: string }>,
  outEdges: Array<{ id: string }>,
): void {
  try {
    reactFlowInstance.deleteElements({
      nodes: [{ id }],
      edges: inEdges.concat(outEdges).map((edge) => ({ id: edge.id })),
    });
  } catch (error) {
    console.error(`Error deleting ReactFlow elements for node ${id}:`, error);
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

    if (node && hasInnerGraph(node)) {
      removeInnerGraphTabs(node);
    }

    removeNodeFromGraph(graph, id);
    dispatch.graph.checkClearSelectedNode(id);
    removeReactFlowElements(reactFlowInstance, id, inEdges, outEdges);
  };
};
