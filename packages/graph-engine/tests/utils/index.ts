import {
	ApplyCapabilities,
	ControlFlowCapabilityFactory,
	ControlFlowNode,
	Graph,
	INodeDefinition,
	WithControlFlow
} from '@/index.js';
import {
	DataFlowCapabilityFactory,
	WithDataFlow
} from '@/capabilities/dataflow.js';
import { vi } from 'vitest';

export const getDataFlowGraph = () => {
	const graph = new Graph();

	graph.registerCapability(DataFlowCapabilityFactory);
	return graph as ApplyCapabilities<Graph, [WithDataFlow]>;
};

export const getControlFlowGraph = () => {
	const graph = new Graph();
	graph.registerCapability(ControlFlowCapabilityFactory);
	return graph as ApplyCapabilities<Graph, [WithControlFlow]>;
};

export const getFullyFeaturedGraph = () => {
	const graph = new Graph();
	graph.registerCapability(DataFlowCapabilityFactory);
	graph.registerCapability(ControlFlowCapabilityFactory);
	return graph as ApplyCapabilities<Graph, [WithDataFlow, WithControlFlow]>;
};

export class ControlFlowSpy extends ControlFlowNode {
	public spiedFunction;

	constructor(props: INodeDefinition) {
		super(props);
		this.spiedFunction = vi.fn();
		this.controlflow.addInput('value', this.spiedFunction);
	}
}
