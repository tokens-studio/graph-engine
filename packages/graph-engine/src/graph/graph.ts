import { AnySchema } from '../schemas/index.js';
import { Edge } from '../programmatic/edge.js';
import { Input } from '../programmatic/dataflow/input.js';
import { Node } from '../programmatic/nodes/node.js';
import { VERSION } from '../constants.js';
import {
	annotatedCapabilityPrefix,
	annotatedId,
	annotatedPlayState,
	annotatedVariadicIndex,
	annotatedVersion
} from '../annotations/index.js';
import { compareVersions } from 'compare-versions';
import { dedupe } from '@/utils/dedupe.js';
import { makeObservable, observable, toJS } from 'mobx';
import { v4 as uuid } from 'uuid';
import type { CapabilityFactory } from '@/capabilities/interface.js';
import type { NodeFactory, SerializedGraph } from './types.js';
import type { NodeRun, NodeStart } from '../types.js';




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

export type FinalizerType = 'serialize' | 'output' | 'clone' | 'nodeAdded';

//Add a typescript type for the finalizer to dynamically lookup the type
export type FinalizerLookup = {
	serialize: SerializedGraph;
	output: any;
	clone: Graph
	edgeAdded: Edge;
	nodeAdded: Node
};

export type SubscriptionLookup = {
	nodeAdded: Node;
	nodeRemoved: string;
	edgeAdded: Edge;
	edgeRemoved: string;
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

export type PlayState = 'playing' | 'paused' | 'stopped';

export interface IGraph {
	/**
	 * Whether to automatically update the graph when the state changes or to wait for an explicit call to update
	 */
	autoUpdate?: boolean;
	annotations?: Record<string, any>;
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

	/**
	 * Used internally to store capability factories
	 */
	private _cf: CapabilityFactory[] = [];

	nodes: Record<string, Node>;
	edges: Record<string, Edge>;
	capabilities: Record<string, any> = {};

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
			annotations: observable.shallow
		});

		this.annotations[annotatedId] || (this.annotations[annotatedId] = uuid());
	}

	/**
	 * Checks to see if there exists any connection for an input
	 * @param source
	 * @param port
	 * @returns
	 */
	hasConnectedInput(source: Node, input: Input): boolean {
		const edges = this.inEdges(source.id);

		return edges.some(x => x.targetHandle === input.name);
	}

	/**
	 * Clears the graph
	 */
	clear() {
		//Clear all the nodes. This will also remove all the edges
		this.getNodeIds().forEach(x => this.removeNode(x));
	}

	addNode(node: Node) {
		if (node.factory) {
			this.checkCapabilitites(node.factory.annotations);
		}

		this.nodes[node.id] = node;
		this.emit('nodeAdded', node);

		this.applyFinalizers('nodeAdded', node);
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
			//We need to check if its pointing to a variadic input and compact it if needed
			if (input.variadic) {
				//Remove the index
				const newVal = [...(input.value || [])];
				newVal.splice(index, 1);
				input.setValue(newVal, {
					noPropagate: true
				});
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

		this.emit('edgeRemoved', edgeId);
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
		//Make sure the playing state is not serialized. This would likely cause issues
		delete annotations[annotatedPlayState];

		const serialized = {
			nodes: Object.values(this.nodes).map(x => x.serialize()),
			edges: Object.values(this.edges).map(x => x.serialize()),
			annotations
		};
		return this.applyFinalizers('serialize', serialized);
	}

	applyFinalizers<T extends keyof FinalizerLookup>(
		type: T,
		value: SerializerType<T>
	): SerializerType<T> {
		return (this.finalizers[type] || []).reduce((acc, x) => x(acc), value);
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
	async deserialize(
		serialized: SerializedGraph,
		lookup: Record<string, NodeFactory>
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
		//Check that all capabilities are present

		//Look for annotations that mention capabilities and check that a key is present.
		//We assume that the capabilities have already been loaded
		this.checkCapabilitites(this.annotations);

		//Life cycle
		// 1 - Create the nodes
		// 2 - Create the edges

		//We don't execute anything here till needed

		await Promise.all(
			serialized.nodes.map(async node => {
				const factory = lookup[node.type];
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

			if (!source.outputs[theEdge.sourceHandle]) {
				//This must be a dynamic output. We create a new one with any type as its likely dependent on runtime anyway
				source.addOutput(theEdge.sourceHandle, {
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
		this._cf.push(factory);
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
		this._cf.forEach((value) => {
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

		return this.applyFinalizers('clone', clonedGraph);
	}

	forEachNode(cb) {
		Object.values(this.nodes).forEach(cb);
	}
	/**
	 * Returns the ids of the node that are immediate successors of the given node. O(m) the amount of edges
	 * @param nodeId
	 * @returns
	 */
	successors(nodeId): Node[] {
		const outEdges = this.outEdges(nodeId);
		//Since we might have multiple connections between the same nodes, we need to remove duplicates
		return dedupe(outEdges.map(x => x.target)).map(x => this.nodes[x]);
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
			targetPort.setValue((targetPort.value || []).concat([sourcePort.value]), {
				//TODO
				// Note that this is a quick fix and that we should probably restrict the update of the typing so that it cannot be overriden later
				type: {
					type: 'array',
					items: sourcePort.type
				}
			});
		}

		const finalEdge = this.applyFinalizers('edgeAdded', edge);
		sourcePort?._edges.push(edge);
		this.emit('edgeAdded', finalEdge);
		return
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
		(this.listeners[type] ||= []).push(listener);
		return () => {
			this.listeners[type] = this.listeners[type].filter(x => x !== listener);
		};
	}

	onFinalize<T extends keyof FinalizerLookup = keyof FinalizerLookup>(
		type: T,
		listener: (...args: ListenerType<FinalizerLookup[T]>) => FinalizerLookup[T]
	) {
		(this.finalizers[type] ||= []).push(listener);
		return () => {
			this.finalizers[type] = this.finalizers[type].filter(x => x !== listener);
		};
	}
}
