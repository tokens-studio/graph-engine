import type { Node } from './programmatic/node';

export type ExternalLoadOptions = { type: string; id: string; data: any };
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
export type Color = string;

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
