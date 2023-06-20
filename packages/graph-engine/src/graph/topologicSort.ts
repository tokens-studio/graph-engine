/**
 * @packageDocumentation
 * This is a simplified topologic sort that does not use a graph library like graphlib which causes bloat in the bundle size
 */

import { Graph, Node } from "./graph.js";

/**
 * Note that this will fail if there are cycles in the graph
 * @param graph
 * @returns
 */
export function topologicalSort(graph: Graph): string[] {
  const visited = new Set();
  const stack: string[] = [];

  function dfs(node: string) {
    visited.add(node);

    const neighbors = graph.successors(node);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
    stack.unshift(node); // Add node to the front of the stack
  }

  graph.getNodeIds().forEach((node) => {
    if (!visited.has(node)) {
      dfs(node);
    }
  });

  return stack;
}
