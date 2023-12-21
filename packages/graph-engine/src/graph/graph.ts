import {
  FlowGraph,
  MinimizedEdge,
  MinimizedFlowGraph,
  MinimizedNode,
} from "./types.js";

/**
 * Generates a stable edge
 * @param v The starting node
 * @param w The end node
 * @param sourceHandle The property on the starting node
 * @param targetHandle The property on the end node
 * @returns
 */
function genEdgeId(
  v: string,
  w: string,
  sourceHandle: string,
  targetHandle: string
) {
  return `${v}:${sourceHandle}→${w}:${targetHandle}}`;
}
interface IMinimizedFlowGraph {
  quiet?: boolean;
}

/**
 * Converts the UI graph to a minimized graph that can be used for execution.
 * The UI graph contains additional information like positioning,etc that is not needed for execution
 * @param graph
 * @returns
 */
export const minimizeFlowGraph = (
  graph: FlowGraph,
  opts: IMinimizedFlowGraph = { quiet: false }
): MinimizedFlowGraph => {
  const state = graph.state || {};
  const { quiet } = opts;

  const nodeLookup = {};

  const nodes = graph.nodes.map((x) => {
    //This is all thats required to be stored. We don't care about the rest of the graph.

    nodeLookup[x.id] = true;
    return {
      id: x.id,
      data: state[x.id] || {},
      type: x.type,
    } as MinimizedNode;
  });

  return {
    version: graph.version,
    nodes,
    edges: graph.edges.reduce((acc, x) => {
      if (!quiet && (!nodeLookup[x.source] || !nodeLookup[x.target])) {
        console.warn("Edge is not connected to a node. Ignoring...", x);
        return acc;
      }

      acc.push({
        id: x.id,
        target: x.target,
        source: x.source,
        //We might remove these in the future
        sourceHandle: x.sourceHandle,
        targetHandle: x.targetHandle,
      } as MinimizedEdge);

      return acc;
    }, [] as MinimizedEdge[]),
  };
};

export type Node<T = any> = {
  id: string;
  data: T;
  /**
   * The type of the node
   */
  type: string;
};

export type Edge<T = any> = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  data: T;
};

export type EdgeOpts = {
  /**
   * Any additional data to be stored on the edge
   */
  data?: any;
};

/**
 * This is our internal graph representation that we use to performa transformations on
 */
export class Graph {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  /**
   * Outgoing edges from a node. This is used to track  when there are multiple edges between the same nodes
   * eg out['a']['a→b:namedEdge']
   */
  out: Record<string, Record<string, Edge>>;
  /**
   * Outgoing edges from a node as an array of edgeIds
   */
  successorNodes: Record<string, string[]>;
  constructor() {
    this.nodes = {};
    this.out = {};
    this.successorNodes = {};
    this.edges = {};
  }
  setNode(id: string, type: string, data: any = undefined) {
    this.nodes[id] = {
      id,
      type,
      data,
    };
  }
  getNodeIds() {
    return Object.keys(this.nodes);
  }
  /**
   * Returns the ids of the node that are successors of the given node
   * @param nodeId
   * @returns
   */
  successors(nodeId) {
    return this.successorNodes[nodeId] || [];
  }
  /**
     * 
     * @param source 
     * @param target 

     * @param data 
     */
  setEdge(
    id: string,
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string,
    opts: EdgeOpts = {}
  ) {
    const { data } = opts;
    const edge = {
      source,
      target,
      sourceHandle,
      targetHandle,
      id,
      data,
    };
    //Initialize the successors
    this.successorNodes[source] = this.successorNodes[source] || [];
    this.successorNodes[source].push(target);
    //Initialize the outgoing edges
    this.out[source] = this.out[source] || {};
    this.out[source][id] = edge;
    //Store the edge
    this.edges[id] = edge;
  }

  /**
   * Return all edges that are pointed out by node v.
   */
  outEdges(node: string): Edge[] {
    const outEdges = this.out[node] || {};
    return Object.values(outEdges);
  }
  edge(edgeId: string): Edge | undefined {
    return this.edges[edgeId];
  }
}
