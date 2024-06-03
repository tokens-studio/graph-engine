import type { NodeFactory, SerializedGraph } from "./types.js";
import { VERSION } from "../constants.js";
import cmp from "semver-compare";
import { Node } from "../programmatic/node.js";
import { v4 as uuid } from 'uuid';
import { ExternalLoader } from "./externalLoader.js";
import { AnySchema, GraphSchema } from "../schemas/index.js";
import { Output } from "../programmatic/output.js";
import { ISetValue, Input } from "../programmatic/input.js";
import { topologicalSort } from "./topologicSort.js";
import { makeObservable, observable } from "mobx";
import { Edge, VariadicEdgeData } from "../programmatic/edge.js";
import { annotatedCapabilityPrefix, annotatedPlayState, annotatedVariadicIndex, annotatedVersion } from "../annotations/index.js";

export type CapabilityFactory = {
  name: string;
  register: (graph: Graph) => any;
  version?: string;
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
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;

  /**
   * Any additional data to be stored on the edge
   */
  annotations?: Record<string, any>;
  /**
   * Whether to automatically update the graph when the state changes or to wait for an explicit call to update
   */
  noPropagate?: boolean;
};

const dedup = (arr: string[]) => [...new Set(arr)];

export type FinalizerType = 'serialize' | 'output';

//Add a typescript type for the finalizer to dynamically lookup the type
export type FinalizerLookup = {
  serialize: SerializedGraph;
  output: any
};

export type SubscriptionLookup = {
  nodeAdded: Node;
  nodeRemoved: string;
  edgeAdded: Edge;
  edgeRemoved: string;
  nodeUpdated: Node;
  edgeUpdated: Edge;
  start: {};
  stop: {};
  pause: {};
  resume: {};
  edgeIndexUpdated: Edge;
  valueSent: Edge[];
  nodeExecuted: Node;
};

export type ListenerType<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [void] ? [] : [T];

export type SubscriptionExecutor<T extends keyof SubscriptionLookup> = (data: SubscriptionLookup[T]) => void;

export type SerializerType<T extends keyof FinalizerLookup> = FinalizerLookup[T]

export type FinalizerExecutor<Type extends keyof FinalizerLookup> = (value: SerializerType<Type>) => SerializerType<Type>

export type PlayState = "playing" | "paused" | "stopped";


export interface IGraph {
  /**
   * Whether to automatically update the graph when the state changes or to wait for an explicit call to update
   */
  autoUpdate?: boolean;
  annotations?: Record<string, any>;
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
  error?: Error;
}

export interface BatchExecution {
  start: number;
  end: number;
  stats?: Record<string, StatRecord>;
  order: string[];
  output?: {
    value: any;
    type: GraphSchema;
  };
}

const defaultGraphOpts: IGraph = {
  annotations: {}
};
/**
 * This is our internal graph representation that we use to perform transformations on
 */
export class Graph {
  private finalizers: Record<string, any[]> = {};
  private listeners: Record<string, any[]> = {};
  public annotations: Record<string, any> = {};


  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  capabilities: Record<string, any> = {};

  messageQueue: {
    eventName: string;
    data: any;
    origin: Node;
  }[] = [];

  externalLoader?: ExternalLoader;
  /**
   * Outgoing edges from a node as an array of edgeIds
   * First key is the source node
   * Values are the edgeIds
   */
  successorNodes: Record<string, string[]> = {};

  constructor(input: IGraph = defaultGraphOpts) {
    this.annotations = input.annotations || {};
    this.nodes = {};
    this.edges = {};

    makeObservable(this, {
      annotations: observable,
    });

    this.annotations['engine.id'] || (this.annotations['engine.id'] = uuid());
  }

  /**
   * Meant to be used internally by nodes to load resources
   * @param uri
   * @param node
   * @param data
   * @returns
   */
  async loadResource(uri: string, node: Node, data?: any) {
    if (!this.externalLoader) {
      throw new Error("No external loader specified");
    }
    return this.externalLoader({
      uri,
      graph: this,
      node,
      data,
    });
  }

  /**
   * Connects two nodes together. If the target is variadic, it will automatically add the index to the edge data if not provided
   * @param source 
   * @param sourceHandle 
   * @param target 
   * @param targetHandle 
   * @param variadicIndex 
   * @returns 
   */
  connect(
    source: Node,
    sourceHandle: Output,
    target: Node,
    targetHandle: Input,
    variadicIndex: number = -1
  ): Edge {
    //If its variadic we need to check the existing edges
    let annotations = {};
    if (targetHandle.variadic) {
      const edges = this.inEdges(target.id, targetHandle.name);
      //The number of edges is the new index
      annotations = { [annotatedVariadicIndex]: variadicIndex == -1 ? edges.length : variadicIndex } as VariadicEdgeData;
    }
    //Check to see if there is already a connection on the target
    if (targetHandle._edges.length > 0 && !targetHandle.variadic) {
      throw new Error(`Input ${targetHandle.name} on node ${target.id} is already connected`);
    }

    //TODO validation of type
    return this.createEdge({
      id: uuid(),
      source: source.id,
      target: target.id,
      sourceHandle: sourceHandle.name,
      targetHandle: targetHandle.name,
      annotations,
    });
  }

  /**
   * Checks to see if there exists any connection for an input
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

    if (node.factory) {
      this.checkCapabilitites(node.factory.annotations);
    }

    this.nodes[node.id] = node;
    this.emit("nodeAdded", node);

    //Trigger the onStart event if the graph is in play mode
    if (this.annotations[annotatedPlayState] === 'playing') {
      node.onStart();
    }
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

    this.emit("nodeRemoved", nodeId);
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
      const index = edge.annotations[annotatedVariadicIndex]!;
      const input = target.inputs[edge.targetHandle];
      if (input) {
        //Note that the edges might not be in order 
        input._edges = input._edges.reduce((acc, x) => {
          //Excluded the edge
          if (x.id === edgeId) {
            return acc;
          }
          if (x.annotations[annotatedVariadicIndex]! > index) {
            //Update the index
            x.annotations[annotatedVariadicIndex] = x.annotations[annotatedVariadicIndex] - 1;
            this.emit('edgeIndexUpdated', x);
          }
          return acc.concat(x);
        }, [] as Edge[]);
      }
      //We need to check if its pointing to a variadic input and compact it if needed
      if (input.variadic) {
        //Remove the index
        const newVal = [...(input.value || [])];
        newVal.splice(index, 1);
        input.setValue(newVal, {
          noPropagate: true,
        });
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

    this.emit("edgeRemoved", edgeId);
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
  /**
   * Serialize the graph for transport
   * @returns 
   */
  serialize(): SerializedGraph {


    const annotations = {
      ...this.annotations,
      //Ensure we update the version
      [annotatedVersion]: VERSION
    };
    //Make sure the playing state is not serialized. This would likely cause issues
    delete annotations[annotatedPlayState];

    const serialized = {
      nodes: Object.values(this.nodes).map((x) => x.serialize()),
      edges: Object.values(this.edges).map((x) => x.serialize()),
      annotations,
    };
    return (this.finalizers['serialize'] || []).reduce((acc, x) => x(acc), serialized);
  }

  /**
   * Extracts the nodes types from a serialized graph
   * @param graph
   */
  static extractTypes(graph: SerializedGraph): string[] {
    return Object.values(graph.nodes.map((x) => x.type));
  }

  checkCapabilitites(annotations: Record<string, any>) {
    Object.entries(annotations).forEach(([key]) => {
      if (key.startsWith(annotatedCapabilityPrefix)) {
        const capabilityName = key.replace(annotatedCapabilityPrefix, '');
        if (!this.capabilities[capabilityName]) {
          throw new Error(`Capability ${capabilityName} is missing`);
        }
      }
    });
  }

  /**
   * Creates a graph from a serialized graph. Note that the types of the nodes must be present in the lookup.
   * @param input
   * @param lookup
   */
  deserialize(
    serialized: SerializedGraph,
    lookup: Record<string, NodeFactory>
  ): Graph {

    const version = serialized.annotations && serialized.annotations['engine.version'] || '0.0.0';

    //Previously graphs didn't contain the version
    if (cmp(version || "0.0.0", VERSION) == -1) {
      throw new Error(
        `Graph version is older than engine version. This might cause unexpected behaviour. Graph version: ${version}, Engine version: ${VERSION}`
      );
    }

    this.annotations = serialized.annotations;
    //Check that all capabilities are present

    //Look for annotations that mention capabilities and check that a key is present.
    //We assume that the capabilities have already been loaded
    this.checkCapabilitites(this.annotations);

    //Life cycle
    // 1 - Create the nodes
    // 2 - Create the edges

    //We don't execute anything here till needed

    serialized.nodes.forEach((node) => {
      const factory = lookup[node.type];
      factory.deserialize({
        serialized: node,
        graph: this,
        lookup
      });
    });

    this.edges = serialized.edges.reduce((acc, edge) => {
      //Don't change the edge

      const theEdge = Edge.deserialize(edge);
      acc[edge.id] = theEdge;

      //Find the source and target nodes and add the edge to them
      const source = this.nodes[theEdge.source];
      const target = this.nodes[theEdge.target];

      if (!source) {
        throw new Error(`No source node found with id ${theEdge.source}`);
      }
      if (!target) {
        throw new Error(`No target node found with id ${theEdge.target}`);
      }

      if (!source.outputs[theEdge.sourceHandle]) {
        //This must be a dynamic output. We create a new one with any type as its likely dependent on runtime anyway
        source.addOutput(theEdge.sourceHandle, {
          type: AnySchema,
        });
      }
      if (!target.inputs[theEdge.targetHandle]) {
        throw new Error(
          `No input found on target node ${target.id} with handle ${theEdge.targetHandle}`
        );
      }

      source.outputs[theEdge.sourceHandle]._edges.push(theEdge);
      target.inputs[theEdge.targetHandle]._edges.push(theEdge);

      return acc;
    }, {});
    return this;
  }

  registerCapability(factory: CapabilityFactory) {
    const value = factory.register(this);
    this.capabilities[factory.name] = value;
    //Make it obvious that this capability is present on the serialized graph
    this.annotations['engine.capabilities.' + factory.name] = factory.version || '0.0.0';
  }
  /**
   * Starts the graph in network mode 
   * TODO Complete
   */
  start = () => {
    this.annotations[annotatedPlayState] = 'playing';
    this.emit("start", {});
    //Trigger the start of all the nodes
    Object.values(this.nodes).forEach((node) => node.onStart());
  }
  /**
   * Stops the graph in network mode
   */
  stop = () => {
    this.annotations[annotatedPlayState] = 'stopped';
    this.emit("stop", {});
    //Trigger the start of all the nodes
    Object.values(this.nodes).forEach((node) => node.onStop());
  }

  pause = () => {
    this.annotations[annotatedPlayState] = 'paused';
    this.emit("pause", {});
    //Trigger the start of all the nodes
    Object.values(this.nodes).forEach((node) => node.onPause());
  }
  resume = () => {
    this.annotations[annotatedPlayState] = 'playing';
    this.emit("resume", {});
    //Trigger the start of all the nodes
    Object.values(this.nodes).forEach((node) => node.onResume());
  }

  /**
   * Triggers a message on the graph
   * TODO Complete
   * @param eventName 
   * @param data 
   * @param origin 
   */
  trigger = (eventName: string, data: any, origin: Node) => {
    //Add to the message queue
    this.messageQueue.push({
      eventName,
      data,
      origin
    });
  }


  /**
   * Executes the graph as a single batch. This will execute all the nodes in the graph and return the output of the output node
   * @param opts
   * @throws {BatchRunError}
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

        const opts: ISetValue = {
          //We are controlling propagation
          noPropagate: true,
        };
        //Only necessary if there is dynamic typing involved
        if (value.type) {
          opts.type = value.type;
        }

        //Its possible that there is no input with the name
        input.inputs[key]?.setValue(value.value, opts);
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
      if (res.error) {
        //@ts-ignore
        (res.error as BatchRunError).nodeId = nodeId;
        throw res.error;
      }

      if (stats) {
        statsTracker[nodeId] = res;
      }

      //Propagate the values
      this.propagate(nodeId, true);
    }

    let output: BatchExecution["output"] = undefined;

    //Get the output node
    const outputNode = Object.values(this.nodes).find(
      (x) => x.factory.type === "studio.tokens.generic.output"
    );

    if (outputNode) {
      const outputPort = outputNode.outputs.value;
      output = {
        value: outputPort.value,
        type: outputPort.type,
      };
    }

    const end = performance.now();
    return {
      order: topologic,
      stats: statsTracker,
      start,
      end,
      output,
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
  /**
   * Triggers a ripple effect on the graph starting from the given edge
   * @returns 
   */
  ripple(output: Output) {

    //Get the edges 
    const edges = output._edges;

    const targets = edges.reduce((acc, edge) => {
      const target = this.getNode(edge.target);
      if (!target) {
        return;
      }
      //Get the input
      const input = target.inputs[edge.targetHandle];
      if (!input) {
        return acc;
      }

      //Check if setting the value would result in an execution
      //If pure and the value is the same ignore
      if (!input.impure && input.value === output.value) {
        return acc;
      }


      if (input.variadic) {
        //Don't attempt mutation of the original array
        const newVal = [...(input.value || [])];
        newVal[edge.annotations[annotatedVariadicIndex]!] = output.value;
        //Extend the variadic array
        input.setValue(newVal, {
          //Create a new type assuming that the items will be of the same type 
          type: {
            type: "array",
            items: output.type
          },
          //We are controlling propagation
          noPropagate: true,
        });
      } else {
        input.setValue(output.value, {
          type: output.type,
          //We are controlling propagation
          noPropagate: true,
        });
      }


      return acc.concat(target);
    }, []);
    //Cheaper to emit once 
    this.emit("valueSent", edges);

    //Now we need to execute the targets. An output might be connected multiple times to the same target so we will need to dedup
    dedup(targets.map((x) => x.id)).forEach((x) => this.update(x));
  }

  /**
   * Triggers the execution of the node and updates the successor nodes
   * @param nodeId 
   * @param oneShot 
   * @returns 
   */
  async propagate(nodeId: string, oneShot: boolean = false) {
    const node = this.getNode(nodeId);
    if (!node) {
      return;
    }
    //Update all the outgoing edges
    const outEdges = this.outEdges(node.id);
    /**
     * This is a heuristic to not attempt to update nodes that don't have a detected port at the end-
     */
    const affectedNodes = outEdges
      .map((edge) => {
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

        if (input.variadic) {
          //Don't attempt mutation of the original array
          const newVal = [...(input.value || [])];
          newVal[edge.annotations[annotatedVariadicIndex]!] = output.value;
          //Extend the variadic array
          input.setValue(newVal, {
            //Create a new type assuming that the items will be of the same type 
            type: {
              type: "array",
              items: node.outputs[edge.sourceHandle].type
            },
            //We are controlling propagation
            noPropagate: true,
          });
        } else {
          input.setValue(value, {
            type: node.outputs[edge.sourceHandle].type,
            //We are controlling propagation
            noPropagate: true,
          });
        }

        return edge.target;
      })
      //Remove holes
      .filter(Boolean) as string[];

    if (!oneShot) {
      //These are the nodes to be update
      const nodes = dedup(affectedNodes);
      await Promise.all(nodes.map((x) => this.update(x)));
    }


  }
  /**
   * Creates an edge connection between two nodes
   * @param source
   * @param target
   * @param data
   */
  createEdge(opts: EdgeOpts): Edge {
    const { source, target, sourceHandle, targetHandle, id } = opts;
    const edge = new Edge(opts);

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

    if (targetPort.variadic) {
      //Extend the variadic array
      targetPort.setValue((targetPort.value || []).concat([sourcePort.value]));
    }

    sourcePort._edges.push(edge);
    this.emit("edgeAdded", edge);
    this.propagate(source);
    return edge;
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

  emit<P extends keyof SubscriptionLookup = keyof SubscriptionLookup>(type: P, data: SubscriptionLookup[P]) {
    (this.listeners[type] || []).forEach((x) => x(data));
  }

  on<P extends keyof SubscriptionLookup = keyof SubscriptionLookup>(type: P, listener: (...args: ListenerType<SubscriptionLookup[P]>) => void) {
    (this.listeners[type] || (this.listeners[type] = [])).push(listener);
    return () => {
      this.listeners[type] = this.listeners[type].filter((x) => x !== listener);
    };
  }

  onFinalize<T extends keyof FinalizerLookup = keyof FinalizerLookup>(type: T, listener: (...args: ListenerType<FinalizerLookup[T]>) => FinalizerLookup[T]) {
    (this.finalizers[type] || (this.finalizers[type] = [])).push(listener);
    return () => {
      this.finalizers[type] = this.finalizers[type].filter((x) => x !== listener);
    };
  }
}