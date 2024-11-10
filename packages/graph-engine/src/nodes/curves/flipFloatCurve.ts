import { BooleanSchema, FloatCurveSchema } from '../../schemas/index.js';
import {
	FloatCurve,
	INodeDefinition,
	ToInput,
	ToOutput,
	Vec2
} from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends Node {
	static title = 'Flip Float Curve';
	static type = 'studio.tokens.curve.flipFloat';
	static description = 'Flips a float curve horizontally, vertically, or both';

	declare inputs: ToInput<{
		curve: FloatCurve;
		flipHorizontal: boolean;
		flipVertical: boolean;
	}>;

	declare outputs: ToOutput<{
		curve: FloatCurve;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('curve', {
			type: FloatCurveSchema
		});
		this.addInput('flipHorizontal', {
			type: {
				...BooleanSchema,
				default: false
			}
		});
		this.addInput('flipVertical', {
			type: {
				...BooleanSchema,
				default: false
			}
		});
		this.addOutput('curve', {
			type: FloatCurveSchema
		});
	}

	flipPoint(point: Vec2, flipH: boolean, flipV: boolean): Vec2 {
		const [x, y] = point;
		return [
			setToPrecision(flipV ? 1 - x : x, 5),
			setToPrecision(flipH ? 1 - y : y, 5)
		];
	}

	execute(): void | Promise<void> {
		const { curve, flipHorizontal, flipVertical } = this.getAllInputs();

		if (!flipHorizontal && !flipVertical) {
			this.outputs.curve.set(curve);
			return;
		}

		const flippedSegments = curve.segments.map(segment =>
			this.flipPoint(segment, flipHorizontal, flipVertical)
		);

		const flippedControlPoints = curve.controlPoints.map(([c1, c2]) => [
			this.flipPoint(c1, flipHorizontal, flipVertical),
			this.flipPoint(c2, flipHorizontal, flipVertical)
		]);

		// If flipping horizontally, we need to reverse the order of points
		if (flipHorizontal) {
			flippedSegments.reverse();
			flippedControlPoints.reverse();
			// Also swap control points within each pair when flipping horizontally
			flippedControlPoints.forEach(points => points.reverse());
		}

		this.outputs.curve.set({
			segments: flippedSegments,
			controlPoints: flippedControlPoints as [Vec2, Vec2][]
		});
	}
}
