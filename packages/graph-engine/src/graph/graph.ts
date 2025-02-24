import { Annotations } from '@/types/annotations.js';
import { AnySchema } from '@/schemas/index.js';
import { CapabilityFactory } from '@/capabilities/interface.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { Edge, VariadicEdgeData } from '../programmatic/edge.js';
import { ILogger, baseLogger } from '../types/logger.js';
import { Node } from '../programmatic/node.js';
import { Port } from '@/programmatic/port.js';
import { VERSION } from '../constants.js';
import {
	annotatedCapabilityPrefix,
	annotatedId,
	annotatedVariadicIndex,
	annotatedVersion
} from '../annotations/index.js';
import { compareVersions } from 'compare-versions';
import { makeObservable, observable, toJS } from 'mobx';
import { nanoid as uuid } from 'nanoid';
import type { ExternalLoader, NodeRun, NodeStart } from '../types.js';
import type { NodeLoader, SerializedGraph } from './types.js';


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
	output: any;
	clone: Graph;
	edgeAdded: Edge;
	nodeAdded: Node;
};

export type SubscriptionLookup = {
	nodeAdded: Node;
	nodeRemoved: string;
	edgeAdded: Edge;
	edgeRemoved: Edge;
	nodeUpdated: Node;
	edgeUpdated: Edge;
	start: object;
	stop: object;
	pause: object;
	resume: object;
	edgeIndexUpdated: Edge;
	valueSent: Edge[];
	nodeExecuted: NodeRun;
	nodeStarted: NodeStart;
};

export type ListenerType<T> = [T] extends [(...args: infer U) => any]
	? U
	: [T] extends [void]
		? []
		: [T];

export type SubscriptionExecutor<T extends keyof SubscriptionLookup> = (
	data: SubscriptionLookup[T]
) => void;

export type SerializerType<T extends keyof FinalizerLookup> =
	FinalizerLookup[T];

export type FinalizerExecutor<Type extends keyof FinalizerLookup> = (
	value: SerializerType<Type>
) => SerializerType<Type>;

export interface IGraph {
	annotations?: Record<string, any>;
}

export type Capabilities = {
	[key: string]: any;
};
const defaultGraphOpts: IGraph = {
	annotations: {}
};

/**
 * This is our internal graph representation that we use to perform transformations on
 */
export class Graph {
	finalizers: Record<string, any[]> = {};
	listeners: Record<string, any[]> = {};
	public annotations: Annotations = {};

	/**
	 * Used internally to store capability factories
	 */
	registeredCapabilities: CapabilityFactory[] = [];

	nodes: Record<string, Node>;
	edges: Record<string, Edge>;
	capabilities: Capabilities;

	logger: ILogger = baseLogger;


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
		this.capabilities = {};

		makeObservable(this, {
			annotations: observable.shallow
		});

		this.annotations[annotatedId] || (this.annotations[annotatedId] = uuid());
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
		this.emit('nodeAdded', node);
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
		inEdges.forEach(edge => this.removeEdge(edge.id));
		outEdges.forEach(edge => this.removeEdge(edge.id));

		//Cleanup the node
		node.dispose();
		//Remove from the lookup
		delete this.nodes[nodeId];

		this.emit('nodeRemoved', nodeId);
		return true;
	}

	/**
	 * Removes an edge connection between two nodes
	 * @param edgeId
	 * @returns
	 */
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
						x.annotations[annotatedVariadicIndex] =
							x.annotations[annotatedVariadicIndex] - 1;
						this.emit('edgeIndexUpdated', x);
					}
					return acc.concat(x);
				}, [] as Edge[]);
			}
		}

		// Get the sources, there might be multiple, and we should not set the output to be disconnected if there are multiple
		const source = this.getNode(edge.source);
		if (source) {
			const output = source.outputs[edge.sourceHandle];
			if (output) {
				output._edges = output._edges.filter(x => x.id !== edgeId);
			}
		}

		//Remove from the lookup
		delete this.edges[edgeId];

		//We do not update the value or recalculate here since that might result in a lot of unnecessary updates

		this.emit('edgeRemoved', edge);
	}
	/**
	 * Retrieves a flat list of all the nodes ids in the graph
	 * @returns
	 */
	getNodeIds() {
		return Object.keys(this.nodes);
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

		const serialized = {
			nodes: Object.values(this.nodes).map(x => x.serialize()),
			edges: Object.values(this.edges).map(x => x.serialize()),
			annotations
		};
		return (this.finalizers['serialize'] || []).reduce(
			(acc, x) => x(acc),
			serialized
		);
	}

	/**
	 * Extracts the nodes types from a serialized graph
	 * @param graph
	 */
	static extractTypes(graph: SerializedGraph): string[] {
		return Object.values(graph.nodes.map(x => x.type));
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
	 * @example
	 * ```typescript
	 * //You should always create a fresh graph when deserializing to avoid side effects
	 * const graph = new Graph().deserialize(serialized, lookup);
	 * ```
	 */
	async deserialize(
		serialized: SerializedGraph,
		lookup: NodeLoader
	): Promise<Graph> {
		const version =
			(serialized.annotations && serialized.annotations['engine.version']) ||
			'0.0.0';

		//Previously graphs didn't contain the version
		if (compareVersions(version || '0.0.0', VERSION) == -1) {
			throw new Error(
				`Graph version is older than engine version. This might cause unexpected behaviour. Graph version: ${version}, Engine version: ${VERSION}`
			);
		}

		this.annotations = serialized.annotations;

		//Life cycle
		// 1 - Create the nodes
		// 2 - Create the edges

		//We don't execute anything here till needed

		await Promise.all(
			serialized.nodes.map(async node => {
				const factory = await lookup(node.type);
				return await factory.deserialize({
					serialized: node,
					graph: this,
					lookup
				});
			})
		);

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

			//TODO remove this. This is awful to have to try fix after the fact
			if (!source.outputs[theEdge.sourceHandle]) {
				//This must be a dynamic output. We create a new one with any type as its likely dependent on runtime anyway
				(source as DataflowNode).dataflow.addOutput(theEdge.sourceHandle, {
					type: AnySchema
				});
			}

			if (!target.inputs[theEdge.targetHandle]) {
				throw new Error(
					`No input found on target node ${target.id} with handle ${theEdge.targetHandle}`
				);
			}

			source.outputs[theEdge.sourceHandle]?._edges.push(theEdge);
			target.inputs[theEdge.targetHandle]?._edges.push(theEdge);

			return acc;
		}, {});

		return this;
	}

	registerCapability(factory: CapabilityFactory) {
		this.registeredCapabilities.push(factory);
		const value = factory.register(this);
		this.capabilities[factory.name] = value;
		//Make it obvious that this capability is present on the serialized graph
		this.annotations['engine.capabilities.' + factory.name] =
			factory.version || '0.0.0';
	}

	clone(): Graph {
		const clonedGraph = new Graph();

		clonedGraph.annotations = {
			...toJS(this.annotations),
			//Create a new id to prevent collisions
			[annotatedId]: uuid()
		};

		const oldToNewIdMap = new Map<string, string>();

		// Clone capabilities
		this.registeredCapabilities.forEach(value => {
			clonedGraph.registerCapability(value);
		});

		// Clone nodes
		this.forEachNode(node => {
			const clonedNode = node.clone(clonedGraph);
			oldToNewIdMap.set(node.id, clonedNode.id);
			clonedNode.setGraph(clonedGraph);
			clonedGraph.addNode(clonedNode);
		});

		// Clone edges
		Object.values(this.edges).forEach(edge => {
			const newSourceId = oldToNewIdMap.get(edge.source);
			const newTargetId = oldToNewIdMap.get(edge.target);

			if (newSourceId && newTargetId) {
				clonedGraph.createEdge({
					id: uuid(),
					source: newSourceId,
					target: newTargetId,
					sourceHandle: edge.sourceHandle,
					targetHandle: edge.targetHandle,
					annotations: { ...toJS(edge.annotations) }
				});
			}
		});

		// Clone capabilities
		Object.entries(this.capabilities).forEach(([key, value]) => {
			clonedGraph.capabilities[key] = value;
		});

		clonedGraph.annotations = {
			...toJS(this.annotations),
			//Create a new id to prevent collisions
			[annotatedId]: uuid()
		};

		return clonedGraph;
	}

	forEachNode(cb) {
		Object.values(this.nodes).forEach(cb);
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
		sourceHandle: Port,
		target: Node,
		targetHandle: Port,
		variadicIndex: number = -1
	): Edge {
		//If its variadic we need to check the existing edges
		let annotations = {};
		if (targetHandle.variadic) {
			const edges = this.inEdges(target.id, targetHandle.name);
			//The number of edges is the new index
			annotations = {
				[annotatedVariadicIndex]:
					variadicIndex == -1 ? edges.length : variadicIndex
			} as VariadicEdgeData;
		}
		//Check to see if there is already a connection on the target
		if (targetHandle._edges.length > 0 && !targetHandle.variadic) {
			throw new Error(
				`Input ${targetHandle.name} on node ${target.id} is already connected`
			);
		}
		return this.createEdge({
			id: uuid(),
			source: source.id,
			target: target.id,
			sourceHandle: sourceHandle.name,
			targetHandle: targetHandle.name,
			annotations
		});
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
		}, [] as string[]);

		return dedup(out).map(x => this.nodes[x]);
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

		sourcePort?._edges.push(edge);
		this.emit('edgeAdded', edge);
		return edge;
	}
	/**
	 * Return all edges that point into the nodes inputs.
	 * O(m) the amount of edges
	 */
	inEdges(nodeId: string, sourceHandle?: string): Edge[] {
		return Object.values(this.edges).filter(x => {
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
		return Object.values(this.edges).filter(x => {
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

	emit<P extends keyof SubscriptionLookup = keyof SubscriptionLookup>(
		type: P,
		data: SubscriptionLookup[P]
	) {
		(this.listeners[type] || []).forEach(x => x(data));
	}

	on<P extends keyof SubscriptionLookup = keyof SubscriptionLookup>(
		type: P,
		listener: (...args: ListenerType<SubscriptionLookup[P]>) => void
	) {
		(this.listeners[type] || (this.listeners[type] = [])).push(listener);
		return () => {
			this.listeners[type] = this.listeners[type].filter(x => x !== listener);
		};
	}

	onFinalize<T extends keyof FinalizerLookup = keyof FinalizerLookup>(
		type: T,
		listener: (...args: ListenerType<FinalizerLookup[T]>) => FinalizerLookup[T]
	) {
		(this.finalizers[type] || (this.finalizers[type] = [])).push(listener);
		return () => {
			this.finalizers[type] = this.finalizers[type].filter(x => x !== listener);
		};
	}
}
