import { Capabilities, Graph } from '@/graph/graph.js';

export type CapabilityFactory = {
	name: string;
	register: (graph: Graph) => any;
	version?: string;
};

export type CombineCapabilities<
	T extends Graph,
	AdditionalCapabilities extends Capabilities
> = Omit<Graph, 'capabilities'> & {
	capabilities: T['capabilities'] & AdditionalCapabilities;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

/**
 * Applies the capabilities to the graph so it can be staticly typed
 *
 * @example
 * ```ts
 * type FullyFeaturedGraph = ApplyCapabilities<Graph, [WithControlFlow, WithDataFlow]>;
 * ````
 */
export type ApplyCapabilities<
	T extends Graph,
	CapabilityTypes extends Capabilities[]
> = CombineCapabilities<T, UnionToIntersection<CapabilityTypes[number]> & Capabilities>;
