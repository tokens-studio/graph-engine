import { CapabilityFactory } from './interface.js';
import { Graph } from '../graph/index.js';
import { PlayControlNode } from '@/programmatic/nodes/playControl.js';
import { annotatedPlayState } from '@/annotations/index.js';

export interface PlayControlCapability {
	start: () => void;
	stop: () => void;
	pause: () => void;
	resume: () => void;
}

export enum PlayState {
	PLAYING = 'playing',
	STOPPED = 'stopped',
	PAUSED = 'paused'
}

export const PlayControlCapabilityFactory: CapabilityFactory = {
	name: 'playControls',
	register: (graph: Graph) => {
		graph.onFinalize('nodeAdded', node => {
			//Trigger the onStart event if the graph is in play mode
			if (graph.annotations[annotatedPlayState] === PlayState.PLAYING) {
				(node as PlayControlNode).playControls?.onStart();
			}
			return node;
		});

		graph.onFinalize('serialize', serialized => {
			//Make sure the playing state is not serialized. This would likely cause issues
			delete serialized.annotations[annotatedPlayState];
			return serialized;
		});

		const ctx = {
			start: () => {
				graph.annotations[annotatedPlayState] = PlayState.PLAYING;
				graph.emit('start', {});
				// Trigger the start of all the nodes
				graph.forEachNode(node =>
					(node as PlayControlNode).playControls?.onStart()
				);
			},
			stop: () => {
				graph.annotations[annotatedPlayState] = PlayState.STOPPED;
				graph.emit('stop', {});
				// Trigger the stop of all the nodes
				graph.forEachNode(node =>
					(node as PlayControlNode).playControls?.onStop()
				);
			},
			pause: () => {
				graph.annotations[annotatedPlayState] = PlayState.PAUSED;
				graph.emit('pause', {});
				// Trigger the pause of all the nodes
				graph.forEachNode(node =>
					(node as PlayControlNode).playControls?.onPause()
				);
			},
			resume: () => {
				graph.annotations[annotatedPlayState] = PlayState.PLAYING;
				graph.emit('resume', {});
				// Trigger the resume of all the nodes
				graph.forEachNode(node =>
					(node as PlayControlNode).playControls?.onResume()
				);
			}
		} as PlayControlCapability;

		return ctx;
	}
};

export type WithPlay = {
	playControls: PlayControlCapability;
};
