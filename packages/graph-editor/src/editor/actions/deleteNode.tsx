import { Dispatch, store } from '@/redux/store.js';
import { Graph } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';
import type { DockLayout, TabData } from 'rc-dock';
import type { MutableRefObject } from 'react';

export const deleteNode = (
  graph: Graph,
  dispatch: Dispatch,
  reactFlowInstance: ReactFlowInstance,
) => {
  return (id: string) => {
    const inEdges = graph.inEdges(id);
    const outEdges = graph.outEdges(id);

    const node = graph.getNode(id);

    if (node && '_innerGraph' in node) {
      const dockerRef = store.getState().refs
        .docker as MutableRefObject<DockLayout>;

      if (dockerRef?.current) {
        const innerGraph = node['_innerGraph'] as {
          annotations: Record<string, unknown>;
        };
        const graphId = innerGraph.annotations['engine.id'];

        // find and remove the tab if it exists
        if (graphId && typeof graphId === 'string') {
          const existing = dockerRef.current.find(graphId) as TabData;
          if (existing) {
            dockerRef.current.dockMove(existing, null, 'remove');
          }
        }
      }
    }

    graph.removeNode(id);

    //Delete from the node as well
    dispatch.graph.checkClearSelectedNode(id);

    //Delete from the react flow instance
    reactFlowInstance.deleteElements({
      nodes: [{ id }],
      edges: inEdges.concat(outEdges).map((edge) => ({ id: edge.id })),
    });

    //We also need to delete any edges that are connected to this node

    if (node) {
      dispatch.graph.appendLog({
        time: new Date(),
        type: 'info',
        data: {
          id: id,
          msg: `Node deleted`,
        },
      });
    }
  };
};
