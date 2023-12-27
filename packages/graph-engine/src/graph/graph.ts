import { SerializedGraph } from "./types.js";
import { VERSION } from "@/constants.js";
import cmp from "semver-compare";
import { Node, NodeFactory } from "@/programmatic/node.js";

import { ExternalLoader } from "./externalLoader.js";
import { GraphSchema } from "@/schemas/index.js";
import { Output } from "@/programmatic/output.js";
import { Input } from "@/programmatic/input.js";
import { topologicalSort } from "./topologicSort.js";

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

export type InputDefinition = {
  value: any;
  type?: GraphSchema;
};

export type GraphExecuteOptions = {
  inputs?: Record<string, InputDefinition>;
  /**
   * Whether to track and emit stats as part of the execution
   */
  stats?: boolean;
  /**
   * Whether to provide a journal of the execution 
   */
  journal?: boolean;
};

export type EdgeOpts = {

  id: string,
  source: string,
  target: string,
  sourceHandle: string,
  targetHandle: string,

  /**
   * Any additional data to be stored on the edge
   */
  data?: any;
  /**
   * Whether to automatically update the graph when the state changes or to wait for an explicit call to update
   */
  noPropagate?: boolean;
};

const dedup = (arr: string[]) => [...new Set(arr)];

export enum SubscriptionType {
  nodeAdded,
  nodeRemoved,
  edgeAdded,
  edgeRemoved,
  nodeUpdated,
  edgeUpdated,
}

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
  noCompare?: boolean;
}

export interface StatRecord {
  start: number;
  end: number;
  error?: Error
}

export interface BatchExecution {
  start: number,
  end: number,
  stats?: Record<string, StatRecord>;
  order: string[];
  output?: {
    value: any;
    type: GraphSchema;
  }
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
    edgeUpdated: [],
  };

  /**
   * Optional description of the graph
   */
  description?: string = "";
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;

  externalLoader?: ExternalLoader;
  /**
   * Outgoing edges from a node as an array of edgeIds
   * First key is the source node
   * Values are the edgeIds
   */
  successorNodes: Record<string, string[]> = {};

  constructor(input: IGraph = defaultGraphOpts) {
    this.description = input.description;
    this.nodes = {};
    this.edges = {};
  }

  connect(
    source: Node,
    sourceHandle: Output,
    target: Node,
    targetHandle: Input,
    data?: any
  ) {
    //TODO validation of type
    this.createEdge({
      id: genEdgeId(source.id, target.id, sourceHandle.name, targetHandle.name),
      source: source.id,
      target: target.id,
      sourceHandle: sourceHandle.name,
      targetHandle: targetHandle.name,
      data
    }
    );


    this.propagate(source.id);
  }

  /**
   * Checks to see if there exists any connection for an inpurt
   * @param source
   * @param port
   * @returns
   */
  hasConnectedInput(source: Node, input: Input): boolean {
    const edges = this.inEdges(source.id);

    return edges.some((x) => x.targetHandle === input.name);
  }

  /**
   * Clears the graph
   */
  clear() {
    //Clear all the nodes. This will also remove all the edges
    this.getNodeIds().forEach((x) => this.removeNode(x));
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

    const inEdges = this.inEdges(nodeId);
    const outEdges = this.outEdges(nodeId);

    //Remove the edges
    inEdges.forEach((edge) => this.removeEdge(edge.id));
    outEdges.forEach((edge) => this.removeEdge(edge.id));

    //Cleanup the node
    node.clear();
    //Remove from the lookup
    delete this.nodes[nodeId];

    this.emit(SubscriptionType.nodeRemoved, nodeId);
    return true;
  }

  removeEdge(edgeId: string) {
    const edge = this.edges[edgeId];
    if (!edge) {
      return;
    }

    //Get the node
    const target = this.getNode(edge.target);
    if (target) {
      const input = target.inputs[edge.targetHandle];
      if (input) {
        input._edges = input._edges.filter((x) => x.id !== edgeId);
      }
    }

    // Get the sources, there might be multiple, and we should not set the output to be disconnected if there are multiple
    const source = this.getNode(edge.source);
    if (source) {
      const output = source.outputs[edge.sourceHandle];
      if (output) {
        output._edges = output._edges.filter((x) => x.id !== edgeId);
      }
    }

    //Remove from the lookup
    delete this.edges[edgeId];

    //We do not update the value or recalculate here since that might result in a lot of unnecessary updates

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
   * Will forcefully update a node in the graph. This will also update all the edges that are connected to the node recursively
   * @throws[Error] if the node is not found
   * @param nodeID
   */
  async update(nodeID: string, opts?: IUpdateOpts) {
    const { noRecursive = false } = opts || {};

    const node = this.nodes[nodeID];
    if (!node) {
      throw new Error(`No node found with id ${nodeID}`);
    }

    const res = await node.run();
    if (res.error) {
      console.error(res.error);
      return;
    }

    if (noRecursive) {
      return;
    }

    await this.propagate(node.id);
  }

  serialize(): SerializedGraph {
    return {
      version: VERSION,
      nodes: Object.values(this.nodes).map((x) => x.serialize()),
      edges: Object.values(this.edges).map((x) => ({
        id: x.id,
        source: x.source,
        target: x.target,
        sourceHandle: x.sourceHandle,
        targetHandle: x.targetHandle,
      })),
    };
  }

  /**
   * Extracts the nodes types from a serialized graph
   * @param graph
   */
  static extractTypes(graph: SerializedGraph): string[] {
    return Object.values(graph.nodes.map((x) => x.type));
  }

  /**
   * Creates a graph from a serialized graph. Note that the types of the nodes must be present in the lookup.
   * @param input
   * @param lookup
   */
  static deserialize(
    serialized: SerializedGraph,
    lookup: Record<string, NodeFactory>
  ): Graph {
    //Previously graphs didn't contain the version
    if (cmp(serialized.version || "0.0.0", VERSION) == -1) {
      throw new Error(
        `Graph version is older than engine version. This might cause unexpected behaviour. Graph version: ${serialized.version}, Engine version: ${VERSION}`
      );
    }

    const g = new Graph();

    //Life cycle
    // 1 - Create the nodes
    // 2 - Create the edges

    //We don't execute anything here till needed

    g.nodes = serialized.nodes.reduce((acc, node) => {
      const factory = lookup[node.type];
      const newNode = (acc[node.id] = factory.deserialize({ ...node }, lookup));
      newNode.setGraph(g);
      return acc;
    }, {});

    g.edges = serialized.edges.reduce((acc, edge) => {


      //Don't change the edge
      acc[edge.id] = {
        ...edge,
      };

      //Find the source and target nodes and add the edge to them
      const source = g.nodes[edge.source];
      const target = g.nodes[edge.target];

      if (!source) {
        throw new Error(`No source node found with id ${edge.source}`);
      }
      if (!target) {
        throw new Error(`No target node found with id ${edge.target}`);
      }

      if (!source.outputs[edge.sourceHandle]) {
        throw new Error(
          `No output found on source node ${source.id} with handle ${edge.sourceHandle}`
        );
      }
      if (!target.inputs[edge.targetHandle]) {
        throw new Error(
          `No input found on target node ${target.id} with handle ${edge.targetHandle}`
        );
      }

      source.inputs[edge.sourceHandle]._edges.push(edge as Edge);
      target.outputs[edge.targetHandle]._edges.push(edge as Edge);

      return acc;
    }, {});
    return g;
  }

  /**
   * Executes the graph as a single batch. This will execute all the nodes in the graph and return the output of the output node
   * @param opts 
   * @returns 
   */
  async execute(opts?: GraphExecuteOptions): Promise<BatchExecution> {
    const { inputs, stats, journal } = opts || {};

    const start = performance.now();
    const statsTracker = {};


    if (inputs) {

      const input = Object.values(this.nodes).find(
        (x) => x.factory.type === "studio.tokens.generic.input"
      );
      if (!input) {
        throw new Error("No input node found");
      }

      //Set the inputs for execution
      Object.entries(inputs).forEach(([key, value]) => {
        input.inputs[key].setValue(value.value, {
          type: value.type,
          //We are controlling propagation
          noPropagate: true
        });
      });

    }



    //Perform a topological sort

    const topologic = topologicalSort(this);

    //This stores intermediate states during execution
    for (let i = 0, c = topologic.length; i < c; i++) {
      const nodeId = topologic[i];

      const node = this.getNode(nodeId);

      // Might happen with graphs that have not cleaned up their edges to nowhere
      if (!node) {
        continue;
      }
      //Execute the node
      const res = await node.run();

      if (stats) {
        statsTracker[nodeId] = res
      }

      //Get the nodes values
      node.outputs;

      //Get the nodes edges

      const edges = this.outEdges(node.id);

      edges.forEach((edge) => {
        const target = this.getNode(edge.target);

        if (!target) {
          return;
        }

        const srcOutput = node.outputs[edge.sourceHandle] as Output;
        const targetInput = target.inputs[edge.targetHandle];

        //Possible dynamic, eg, if it does not exist, ignore
        if (!targetInput) {
          return;
        }
        //Set the value on the target
        targetInput.setValue(srcOutput.value, {
          type: srcOutput.type,
          //We are controlling propagation
          noPropagate: true
        });
      });
    }

    let output: BatchExecution['output'] = undefined;

    //Get the output node
    const outputNode = Object.values(this.nodes).find(
      (x) => x.factory.type === "studio.tokens.generic.output"
    );

    if (outputNode) {
      const outputPort = outputNode.outputs.value;
      output = {
        value: outputPort.value,
        type: outputPort.type,
      }
    }

    const end = performance.now();
    return {
      order: topologic,
      stats: statsTracker,
      start,
      end,
      output
    };
  }

  /**
   * Returns the ids of the node that are immediate successors of the given node. O(m) the amount of edges
   * @param nodeId
   * @returns
   */
  successors(nodeId): Node[] {
    const outEdges = this.outEdges(nodeId);
    //Since we might have multiple connections between the same nodes, we need to remove duplicates
    return dedup(outEdges.map((x) => x.target)).map((x) => this.nodes[x]);
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
    }, [] as string[]);

    return dedup(out).map((x) => this.nodes[x]);
  }

  async propagate(nodeId: string) {

    const node = this.getNode(nodeId);
    if (!node) {
      return;
    }
    //Update all the outgoing edges
    const outEdges = this.outEdges(node.id);
    /**
     * This is a heuristic to not attempt to update nodes that don't have a detected port at the end-
     */
    const affectedNodes = outEdges.map((edge) => {
      const output = node.outputs[edge.sourceHandle] as Output;

      //It might be dynamic 
      if (!output) {
        return;
      }
      const value = node.outputs[edge.sourceHandle].value;
      //write the value to the input port of the target
      const target = this.getNode(edge.target);
      if (!target) {
        return;
      }
      const input = target.inputs[edge.targetHandle];
      if (!input) {
        return;
      }
      input.setValue(value, {
        type: node.outputs[edge.sourceHandle].type,
        //We are controlling propagation
        noPropagate: true
      });
      return edge.target
    })
      //Remove holes
      .filter(Boolean) as string[];

    //These are the nodes to be update
    const nodes = dedup(affectedNodes);
    await Promise.all(nodes.map(x => this.update(x)));
  }
  /**
   * Creates an edge connection between two nodes
   * @param source
   * @param target
   * @param data
   */
  createEdge(opts: EdgeOpts) {
    const { source,
      target,
      sourceHandle,
      targetHandle,
      id, data } = opts;
    const edge = {
      source,
      target,
      sourceHandle,
      targetHandle,
      id,
      data,
    };

    //Validate that the targets exist. This helps to prevent ghost edges
    const sourceNode = this.getNode(source);
    const targetNode = this.getNode(target);

    if (!sourceNode) {
      throw new Error(`Source node ${source} does not exist`);
    }
    if (!targetNode) {
      throw new Error(`Target node ${target} does not exist`);
    }


    //Initialize the successors
    this.successorNodes[source] = this.successorNodes[source] || [];
    this.successorNodes[source].push(target);
    //Store the edge
    this.edges[id] = edge;


    const targetPort = targetNode.inputs[targetHandle];
    const sourcePort = sourceNode.outputs[sourceHandle];

    //Then update the connection on the ports
    targetPort._edges.push(edge);
    sourcePort._edges.push(edge);
    this.emit(SubscriptionType.edgeAdded, edge);
    this.propagate(source);
  }
  /**
   * Return all edges that point into the nodes inputs.
   * O(m) the amount of edges
   */
  inEdges(nodeId: string, sourceHandle?: string): Edge[] {
    return Object.values(this.edges).filter((x) => {

      if (x.target !== nodeId) {
        return false;
      }
      if (sourceHandle) {
        return x.targetHandle === sourceHandle;
      }
      return true;
    });
  }

  /**
   * Return all edges that are pointed out by node v.
   * O(m) the amount of edges
   */
  outEdges(nodeId: string, targetHandle?: string): Edge[] {
    return Object.values(this.edges).filter((x) => {

      if (x.source !== nodeId) {
        return false;
      }
      if (targetHandle) {
        return x.targetHandle === targetHandle;
      }
      return true;

    });
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
    (this.listeners[type] || []).forEach((x) => x(data));
  }

  subscribe(type: SubscriptionType, listener: (data: any) => void) {
    this.listeners[type].push(listener);
    return () => {
      this.listeners[type] = this.listeners[type].filter((x) => x !== listener);
    };
  }
}
