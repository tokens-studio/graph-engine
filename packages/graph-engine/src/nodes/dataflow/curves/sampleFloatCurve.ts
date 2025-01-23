import { DataflowNode, FloatCurve, INodeDefinition } from '../../../index.js';
import { FloatCurveSchema, NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { arrayOf } from '../../../schemas/utils.js';
import { cubicBezier } from './floatCurve.js';
import { setToPrecision } from '../../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Sample Array from Float Curve';
	static type = 'studio.tokens.curve.sampleFloatCurve';
	static description = 'Samples a float curve at given x values';

	declare inputs: ToInput<{
		curve: FloatCurve;
		samplePoints: number[];
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
		this.addInput('samplePoints', {
			type: arrayOf({
				...NumberSchema,
				minimum: 0,
				maximum: 1,
				description: 'X values to sample (between 0 and 1)'
			})
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
		const { curve, samplePoints, precision } = this.getAllInputs();
		const values: number[] = [];

		for (const x of samplePoints) {
			const startIndex = curve.segments.findIndex((segment, idx) => {
				const nextSegment = curve.segments[idx + 1];
				return segment[0] <= x && (!nextSegment || x <= nextSegment[0]);
			});

			const p0 = curve.segments[startIndex];
			const p1 = curve.segments[startIndex + 1];
			const [c1, c2] = curve.controlPoints[startIndex];

			const t = (x - p0[0]) / (p1[0] - p0[0]);
			const y = setToPrecision(
				cubicBezier(p0[1], c1[1], c2[1], p1[1], t),
				precision
			);
			values.push(y);
		}

		this.outputs.values.set(values);
	}
}
