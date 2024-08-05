import { ContrastAlgorithm } from './types/index.js';
import type { Node } from './programmatic/nodes/node.js';

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

export type FloatCurve = {
	//The length of the control points array is always one less than the segments
	controlPoints: [Vec2, Vec2][];
	//The segments stored as monotonicly increasing x values
	segments: Vec2[];
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
