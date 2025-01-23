import { CapabilityFactory } from './interface.js';
import { ControlFlowInput } from '@/programmatic/controlflow/input.js';
import { ControlFlowOutput } from '../programmatic/controlflow/output.js';
import { Graph } from '../graph/index.js';
import { GraphSchema } from '@/schemas/index.js';

export interface ControlFlowCapability {
	/**
	 * Sends a message from an output to all connected inputs
	 * @param output
	 * @param val
	 * @returns
	 */
	ripple: <T = any>(
		output: ControlFlowOutput,
		val: T,
		type?: GraphSchema
	) => void;
}

export const ControlFlowCapabilityFactory: CapabilityFactory = {
	name: 'controlFlow',
	register: (graph: Graph) => {
		const ctx = {
			/**
			 * Triggers a ripple effect on the graph starting from the given edge
			 * @returns
			 */
			ripple<T>(output: ControlFlowOutput, val: T, type?: GraphSchema) {
				//Get the edges
				const edges = output._edges;
				edges.forEach(edge => {
					const input = graph.getNode(edge.target)?.inputs[edge.targetHandle];
					if (!input) {
						return;
					}
					(input as ControlFlowInput).trigger(val, type);
					graph.emit('valueSent', edges);
				});
			}
		} as ControlFlowCapability;

		return ctx;
	}
};

export type WithControlFlow = {
	controlFlow: ControlFlowCapability;
};
