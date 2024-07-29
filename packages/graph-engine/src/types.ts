import { ContrastAlgorithm } from './types/index.js';
import type { Graph } from './graph/graph.js';
import type { Node } from './programmatic/node.js';

export type ExternalLoadOptions = {
	/**
	 * The requesting node
	 */
	node: Node;
	/**
	 * The graph the node belongs to
	 */
	graph: Graph;
	/**
	 * The requested uri
	 */
	uri: string;
	/**
	 * Additional data for the request. This is likely different based on the different node
	 */
	data: any;
};
export type ExternalLoader = (opts: ExternalLoadOptions) => Promise<any> | any;

export type BatchRunError = Error & {
	nodeId: string;
};

export type NodeStart = {
	node: Node;
	start: number;
};

export type NodeRun = {
	node: Node;
	error?: Error;
	start: number;
	end: number;
};

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
//Alias for now, will be replaced with a proper type
export type Color = {
	space: string;
	channels: [number, number, number];
	alpha?: number;
};

export type Curve = {
	curves: {
		type: 'bezier' | 'quadratic' | 'cubic';
		points: [number, number][];
	}[];
};
export type Gradient = {
	type: 'linear' | 'radial' | 'angular' | 'diamond';
	positions: [number, number][];
	stops: GradientStop[];
};

export type GradientStop = {
	position: number;
	color: string;
};

export type ContrastAlgorithmType = keyof typeof ContrastAlgorithm;
