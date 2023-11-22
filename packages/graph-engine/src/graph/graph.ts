import {
  SerializedGraph,
} from "./types.js";
import { VERSION } from "@/constants.js";
import cmp from "semver-compare";
import { Node, NodeFactory } from "@/programmatic/node/index.js";
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

const dedup = (arr: string[]) => [...new Set(arr)];



export enum SubscriptionType { nodeAdded, nodeRemoved, edgeAdded, edgeRemoved, nodeUpdated, edgeUpdated };



export interface IGraph {
  /**
   * Whether to automatically update the graph when the state changes or to wait for an explicit call to update
   */
  autoUpdate?: boolean;
  description?: string;
}

export interface IUpdateOpts {
  /**
   * If true, no memoization will be performed
   */
  noMemo?: boolean;
  /**
   * If true, the update will not be propagated to the successor nodes  
   */
  noRecursive?: boolean;
  /**
   * If true, we won't compare the input values to see if the node needs to be updated
   */
  noCompare?: boolean
}

const defaultGraphOpts: IGraph = {};
/**
 * This is our internal graph representation that we use to perform transformations on
 */
export class Graph {

  private listeners = {
    nodeAdded: [],
    nodeRemoved: [],
    edgeAdded: [],
    edgeRemoved: [],
    nodeUpdated: [],
    edgeUpdated: []
  }

  /**
   * Optional description of the graph
   */
  description?: string = "";
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  /**
   * Outgoing edges from a node as an array of edgeIds
   * First key is the source node
   * Values are the edgeIds
   */
  successorNodes: Record<string, string[]>;

  constructor(input: IGraph = defaultGraphOpts) {
    this.description = input.description;
    this.nodes = {};
    this.edges = {};
  }


  connect(source, sourceHandle, target, targetHandle, data) {
    //TODO validation of type
    this.createEdge(genEdgeId(source.id, target.id, source.name, target.name), source.id, target.id, source.name, target.name, { data })
  }
  enqueueConnection(source, sourceHandle, target, targetHandle) {
    //Get all existing connections for the source and target


    this.connect(source, target, {});
  }


  /**
   * Clears the graph
   */
  clear() {
    //Clear all the nodes. This will also remove all the edges
    this.getNodeIds().forEach(x => this.removeNode(x));
  }

  addNode(node: Node) {
    this.nodes[node.id] = node;
    node.setGraph(this);
    this.emit(SubscriptionType.nodeAdded, node);
  }
  /**
   * Removes a node from the graph and disconnects all the edges.
   * @param nodeId 
   * @returns true if the node was removed, false if the node was not found
   */
  removeNode(nodeId: string): boolean {
    const node = this.nodes[nodeId];
    if (!node) {
      return false;
    }

    //Remove from the lookup
    delete this.nodes[nodeId];
    //Remove reference of the graph 
    node.setGraph(undefined);

    //Remove all incoming edges
    const inEdges = this.in[nodeId] || {};

    //Remove all outgoing edges
    const outEdges = this.out[nodeId] || {};
    Object.values(outEdges).forEach(edge => this.removeEdge(edge.id));
    this.emit(SubscriptionType.nodeRemoved, nodeId);
    return true;
  }

  removeEdge(edgeId: string) {

    const edge = this.edges[edgeId];
    if (!edge) {
      return;
    }
    //Remove from the lookup
    delete this.edges[edgeId];
    //Remove from the outgoing edges
    const outEdges = this.out[edge.source] || {};


    delete outEdges[edgeId];
    //Remove from lookup
    delete this.out[edge.source];

    this.emit(SubscriptionType.edgeRemoved, edgeId);
  }
  /**
   * Retrieves a flat list of all the nodes ids in the graph
   * @returns 
   */
  getNodeIds() {
    return Object.keys(this.nodes);
  }

  /**
   * Will update a node in the graph. This will also update all the edges that are connected to the node recursively
   * @throws[Error] if the node is not found
   * @param nodeID 
   */
  async update(nodeID: string, opts: IUpdateOpts) {

    const node = this.nodes[nodeID];
    if (!node) {
      throw new Error(`No node found with id ${nodeID}`);
    }



    //Update the node
    await node.execute();

    if (opts.noRecursive) {
      return;
    }

    //Update all the outgoing edges
    const outEdges = this.outEdges(nodeID);
    //Get all the values from the outputs 

    Object.entries(node.outputs).forEach(([key, output]) => {

      output.


    })


    //The values should be in the nodes output 










    const outNodes = dedup(outEdges.map(x => x.target));

    outNodes.forEach(outNode => outNode.

      outEdges.forEach(edge => {
        //Update the edge
        this.updateEdge(edge.id);
        //Update the target node
        this.update(edge.target, {} opts);
      });
  }

  serialize(): SerializedGraph {
    return {
      version: VERSION,
      graph: {
        description: this.description,
      },
      nodes: Object.values(this.nodes).map(x => x.serialize()),
      edges: Object.values(this.edges).map(x => ({
        id: x.id,
        source: x.source,
        target: x.target,
        sourceHandle: x.sourceHandle,
        targetHandle: x.targetHandle
      }))
    }
  }

  /**
   * Extracts the nodes types from a serialized graph
   * @param graph 
   */
  static extractTypes(graph: SerializedGraph): string[] {
    return Object.values(graph.nodes.map(x => x.type));
  }


  /**
   * Creates a graph from a serialized graph. Note that the types of the nodes must be present in the lookup.
   * @param input 
   * @param lookup 
   */
  static deserialize(input: SerializedGraph, lookup: Record<string, NodeFactory>): Graph {


    //Previously graphs didn't contain the version
    if (cmp(input.version || "0.0.0", VERSION) == -1) {
      throw new Error(
        `Graph version is older than engine version. This might cause unexpected behaviour. Graph version: ${input.version}, Engine version: ${VERSION}`
      );
    }

    const g = new Graph({ ...input.graph });

    //Life cycle
    // 1 - Create the nodes 
    // 2 - Create the edges

    //We don't execute anything here till needed

    g.nodes = input.nodes.reduce((acc, node) => {
      const factory = lookup[node.type];
      const newNode = acc[node.id] = factory.deserialize({ ...node });
      newNode.setGraph(g);
      return acc;
    }, {});

    g.edges = input.edges.reduce((acc, edge) => {
      //Don't change the edge
      acc[edge.id] = {
        ...edge,
      };
      return acc;
    }, {});
    return g;
  }

  /**
   * Returns the ids of the node that are immediate successors of the given node. O(m) the amount of edges
   * @param nodeId
   * @returns
   */
  successors(nodeId): Node[] {
    const outEdges = this.outEdges(nodeId);
    //Since we might have multiple connections between the same nodes, we need to remove duplicates
    return dedup(outEdges.map(x => x.target)).map(x => this.nodes[x]);
  }

  /**
   * Returns the ids of the node that are immediate predecessors of the given node O(m) the amount of edges
   * @param nodeId
   * @returns
   */
  predecessors(nodeId: string): Node[] {
    //Lookup the node
    const node = this.nodes[nodeId];
    if (!node) {
      return [];
    }
    //Lookup the incoming edges

    //This returns all edge ids that target this node
    const out = Object.values(this.edges).reduce((acc, x) => {

      if (x.target === nodeId) {
        acc.push(x.source);
      }
      return acc;
    }, []);

    return dedup(out).map(x => this.nodes[x]);
  }

  /**
     * Creates an edge connection between two nodes
     * @param source 
     * @param target 
     * @param data 
     */
  createEdge(
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
    //Store the edge
    this.edges[id] = edge;
    this.emit(SubscriptionType.edgeAdded, edge);
  }


  /**
   * Return all edges that are pointed in by node v.
   * O(m) the amount of edges
   */
  inEdges(nodeId: string): Edge[] {
    return Object.values(this.edges).filter(x => x.target === nodeId);
  }

  /**
   * Return all edges that are pointed out by node v.
   * O(m) the amount of edges
   */
  outEdges(nodeId: string): Edge[] {
    return Object.values(this.edges).filter(x => x.source === nodeId);
  }

  /**
   * Looks up a node by its id
   * @param nodeId 
   * @returns 
   */
  getNode(nodeId: string): Node | undefined {
    return this.nodes[nodeId];
  }

  /**
   * Looks up an edge by its id
   * @param edgeId 
   * @returns 
   */
  getEdge(edgeId: string): Edge | undefined {
    return this.edges[edgeId];
  }

  private emit(type: SubscriptionType, data: any) {
    this.listeners[type].forEach(x => x(data));
  }

  subscribe(type: SubscriptionType, listener: (data: any) => void) {
    this.listeners[type].push(listener);
    return () => {
      this.listeners[type] = this.listeners[type].filter(x => x !== listener);
    }
  }
}
