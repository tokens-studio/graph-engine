/**
 * @packageDocumentation
 * This is a simplified topologic sort that does not use a graph library like graphlib which causes bloat in the bundle size
 */

import { Graph } from '../../graph/graph.js';

/**
 * Note that this will fail if there are cycles in the graph
 * @param graph
 * @returns
 */
export function topologicalSort<GraphType extends Graph>(graph: GraphType): string[] {
	const visited = new Set<string>();
	const stack: string[] = [];

	function dfs(node: string) {
		visited.add(node);

		const neighbors = graph.successors(node);
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor.id)) {
				dfs(neighbor.id);
			}
		}
		stack.unshift(node); // Add node to the front of the stack
	}

	//Sort the ids to ensure stability
	graph
		.getNodeIds()
		.sort()
		.forEach(node => {
			if (!visited.has(node)) {
				dfs(node);
			}
		});

	return stack;
}
