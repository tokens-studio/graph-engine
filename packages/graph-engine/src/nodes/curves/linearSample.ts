import { Curve } from '../../types.js';
import { CurveSchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

function deCasteljau(p0, p1, p2, p3, t) {
	const p01 = interpolate(p0, p1, t);
	const p12 = interpolate(p1, p2, t);
	const p23 = interpolate(p2, p3, t);

	const p012 = interpolate(p01, p12, t);
	const p123 = interpolate(p12, p23, t);

	const p0123 = interpolate(p012, p123, t);

	return p0123;
}

function interpolate(p1, p2, t) {
	return {
		x: (1 - t) * p1[0] + t * p2[0],
		y: (1 - t) * p1[1] + t * p2[1]
	};
}

function findTForX(p0, p1, p2, p3, xTarget, iterations = 20) {
	let tMin = 0;
	let tMax = 1;

	for (let i = 0; i < iterations; i++) {
		const tMid = (tMin + tMax) / 2;
		const xMid = deCasteljau(p0, p1, p2, p3, tMid).x;

		if (xMid < xTarget) {
			tMin = tMid;
		} else {
			tMax = tMid;
		}
	}

	return (tMin + tMax) / 2;
}

function getBezierYForGivenX(points, xTarget) {
	const [p0, p1, p2, p3] = points;
	const t = findTForX(p0, p1, p2, p3, xTarget);
	const point = deCasteljau(p0, p1, p2, p3, t);
	return point.y;
}

export default class NodeDefinition extends Node {
	static title = 'Sample Linear Curve';
	static type = 'studio.tokens.curve.linearSample';
	static description = 'Samples a curve at a specified point x';

	declare inputs: ToInput<{
		/**
		 * The curve to sample
		 */
		curve: Curve;
		/**
		 * The sample point to evaluate the curve at. This should be a value between 0 and 1
		 */
		sample: number;
	}>;

	declare outputs: ToOutput<{
		/**
		 * A 2D vector representing the value of the curve at the sample point
		 */
		value: [number, number];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('curve', {
			type: CurveSchema
		});
		this.addInput('sample', {
			type: {
				...NumberSchema,
				default: 0.5
			}
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { curve, sample } = this.getAllInputs();
		//TODO this currently assumes that the curve is purely just beziers
		//First look for the bezier that contains the sample
		const foundCurve = (curve as Curve).curves.find(
			piece =>
				piece.points[0][0] <= sample &&
				piece.points[piece.points.length - 1][0] >= sample
		);

		if (!foundCurve) throw new Error('No curve found for sample');

		const output = getBezierYForGivenX(foundCurve.points, sample);

		this.setOutput('value', output);
	}
}
