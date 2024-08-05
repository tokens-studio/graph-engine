import { Graph, TypeDefinition } from '../index.js';
import { GraphSchema } from '../schemas/index.js';
import { Node } from '../programmatic/nodes/node.js';

export interface SerializedInput {
	name: string;
	value?: any;
	visible: boolean;
	variadic?: boolean;
	type: TypeDefinition;
	dynamicType?: GraphSchema;
	annotations?: Record<string, any>;
}

export interface SerializedNode {
	id: string;
	annotations?: Record<string, any>;
	type: string;
	inputs: SerializedInput[];
}

export interface SerializedEdge {
	id: string;
	source: string;
	target: string;
	sourceHandle: string;
	targetHandle: string;
	annotations?: Record<string, any>;
}

export interface SerializedGraph {
	annotations: Record<string, any>;
	nodes: SerializedNode[];
	edges: SerializedEdge[];
}

export type IDeserializeOpts = {
	serialized: SerializedNode;
	graph: Graph;
	lookup: Record<string, NodeFactory>;
};

export type NodeFactory = typeof Node;
