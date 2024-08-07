import { CapabilityFactory } from './interface.js';
import { ControlFlowInput } from '@/programmatic/controlflow/input.js';
import { ControlFlowNode } from '@/programmatic/nodes/controlflow.js';
import { ControlFlowOutput } from '../programmatic/controlflow/output.js';
import { Graph } from '../graph/index.js';
import { GraphSchema } from '@/schemas/index.js';
import { annotatedPlayState } from '@/annotations/index.js';

export interface ControlFlowCapability {
	start: () => void;
	stop: () => void;
	pause: () => void;
	resume: () => void;
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

export enum PlayState {
	PLAYING = 'playing',
	STOPPED = 'stopped',
	PAUSED = 'paused'
}

export const ControlFlowCapabilityFactory: CapabilityFactory = {
	name: 'controlFlow',
	register: (graph: Graph) => {
		graph.onFinalize('nodeAdded', node => {
			//Trigger the onStart event if the graph is in play mode
			if (graph.annotations[annotatedPlayState] === PlayState.PLAYING) {
				(node as ControlFlowNode).controlflow?.onStart();
			}
			return node;
		});

		graph.onFinalize('serialize', serialized => {
			//Make sure the playing state is not serialized. This would likely cause issues
			delete serialized.annotations[annotatedPlayState];
			return serialized;
		});

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
			},
			start: () => {
				graph.annotations[annotatedPlayState] = 'playing';
				graph.emit('start', {});
				// Trigger the start of all the nodes
				graph.forEachNode(node =>
					(node as ControlFlowNode).controlflow?.onStart()
				);
			},
			stop: () => {
				graph.annotations[annotatedPlayState] = PlayState.STOPPED;
				graph.emit('stop', {});
				// Trigger the stop of all the nodes
				graph.forEachNode(node =>
					(node as ControlFlowNode).controlflow?.onStop()
				);
			},
			pause: () => {
				graph.annotations[annotatedPlayState] = PlayState.PAUSED;
				graph.emit('pause', {});
				// Trigger the pause of all the nodes
				graph.forEachNode(node =>
					(node as ControlFlowNode).controlflow?.onPause()
				);
			},
			resume: () => {
				graph.annotations[annotatedPlayState] = PlayState.PLAYING;
				graph.emit('resume', {});
				// Trigger the resume of all the nodes
				graph.forEachNode(node =>
					(node as ControlFlowNode).controlflow?.onResume()
				);
			}
		} as ControlFlowCapability;

		return ctx;
	}
};

export type WithControlFlow = {
	controlFlow: ControlFlowCapability;
};
