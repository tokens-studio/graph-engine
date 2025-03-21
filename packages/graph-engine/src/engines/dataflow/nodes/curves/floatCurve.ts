import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { FloatCurve, INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { FloatCurveSchema, NumberSchema } from '../../schemas/index.js';

export function cubicBezier(p0, c1, c2, p1, t) {
	return (
		(1 - t) ** 3 * p0 +
		3 * (1 - t) ** 2 * t * c1 +
		3 * (1 - t) * t ** 2 * c2 +
		t ** 3 * p1
	);
}
export default class NodeDefinition extends DataflowNode {
	static title = 'Sample Float Curve';
	static type = 'studio.tokens.curve.sampleFloat';
	static description = 'Evaluates a float curve at a given x value';

	declare inputs: ToInput<{
		curve: FloatCurve;
		//We assume this is a normalized value between 0 and 1
		x: number;
	}>;
	declare outputs: ToOutput<{
		y: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('curve', {
			type: FloatCurveSchema
		});
		this.addInput('x', {
			type: {
				...NumberSchema,
				minimum: 0,
				maximum: 1,
				default: 0
			}
		});
		this.addOutput('y', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { curve, x } = this.getAllInputs();

		//Find the segment where the x value lines between the two x values

		const startIndex = curve.segments.findIndex((segment, i) => {
			const nextSegment = curve.segments[i + 1];
			return segment[0] <= x && x <= nextSegment[0];
		});
		const p0 = curve.segments[startIndex];
		const p1 = curve.segments[startIndex + 1];

		const [c1, c2] = curve.controlPoints[startIndex];

		const t = (x - p0[0]) / (p1[0] - p0[0]);

		// Cubic Bézier formula
		const y = cubicBezier(
			//We need the y values of all of these control points
			p0[1],
			c1[1],
			c2[1],
			p1[1],
			t
		);

		this.outputs.y.set(y);
	}
}
