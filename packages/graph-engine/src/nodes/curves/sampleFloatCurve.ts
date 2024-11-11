import { FloatCurve, INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { FloatCurveSchema, NumberSchema } from '../../schemas/index.js';
import { Node } from '../../programmatic/node.js';
import { arrayOf } from '../../schemas/utils.js';
import { cubicBezier } from './floatCurve.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends Node {
	static title = 'Sample Array from Float Curve';
	static type = 'studio.tokens.curve.sampleFloatCurve';
	static description = 'Samples a float curve at regular intervals';

	declare inputs: ToInput<{
		curve: FloatCurve;
		samples: number;
		precision: number;
	}>;
	declare outputs: ToOutput<{
		values: number[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('curve', {
			type: FloatCurveSchema
		});
		this.addInput('samples', {
			type: {
				...NumberSchema,
				minimum: 2,
				default: 10
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				minimum: 0,
				default: 2
			}
		});
		this.addOutput('values', {
			type: arrayOf(NumberSchema)
		});
	}

	execute(): void | Promise<void> {
		const { curve, samples, precision } = this.getAllInputs();
		const values: number[] = [];

		for (let i = 0; i < samples; i++) {
			const x = i / (samples - 1);

			// Find the segment where x falls
			const startIndex = curve.segments.findIndex((segment, idx) => {
				const nextSegment = curve.segments[idx + 1];
				return segment[0] <= x && (!nextSegment || x <= nextSegment[0]);
			});

			const p0 = curve.segments[startIndex];
			const p1 = curve.segments[startIndex + 1];
			const [c1, c2] = curve.controlPoints[startIndex];

			// Calculate t parameter
			const t = (x - p0[0]) / (p1[0] - p0[0]);

			// Calculate y value using cubic Bézier formula
			const y = setToPrecision(
				cubicBezier(p0[1], c1[1], c2[1], p1[1], t),
				precision
			);
			values.push(y);
		}

		this.outputs.values.set(values);
	}
}
