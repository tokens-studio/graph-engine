import { Graph, Node } from '@tokens-studio/graph-engine';
import { MAIN_GRAPH_ID } from '@/constants.js';
import { createSelector } from 'reselect';
import { graph } from './roots.js';

export const currentNode = createSelector(graph, (state) => state.currentNode);

export const graphSelector = createSelector(graph, (state) => state.graph);

export const logSelector = createSelector(graph, (state) => state.logs);

export const playStateSelector = createSelector(
  graph,
  (state) => state.graphPlayState,
);

export const mainGraphSelector = createSelector(
  graph,
  (state) => state.panels[MAIN_GRAPH_ID],
);

export type TreeNode = {
  node: Node;
  depth: number;
};

const collectNodes = function (
  graph: Graph,
  coll: Record<string, Node> = {},
  depth = 1,
): TreeNode {
  for (const id in graph.nodes) {
    const node: Node = graph.nodes[id];
    const innerGraph = node['_innerGraph'];
    coll[id] = { node, depth } as TreeNode;

    if (innerGraph) {
      collectNodes(innerGraph, coll, ++depth);
    }
  }
  return coll;
};

export const graphNodesSelector = createSelector(graph, (state) => {
  const graph = state.panels[MAIN_GRAPH_ID]?.graph;

  if (!graph) return;

  return collectNodes(graph);
});

export const graphEditorSelector = createSelector(
  graph,
  (state) => state.currentPanel?.ref,
);

export const currentPanelIdSelector = createSelector(
  graph,
  (state) => state.currentPanelId,
);
