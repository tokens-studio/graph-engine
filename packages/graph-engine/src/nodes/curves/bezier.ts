import { Curve } from '../../types.js';
import { CurveSchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, Node } from '../../programmatic/nodes/node.js';
import { ToInput, ToOutput } from '../../programmatic';

export default class BezierCurveNode extends Node {
	static title = 'Bezier Curve';
	static type = 'studio.tokens.curve.bezier';
	static description = 'Creates a bezier curve from two control points';

	declare inputs: ToInput<{
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}>;

	declare outputs: ToOutput<{
		curve: Curve;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('x1', {
			type: {
				...NumberSchema,
				default: 0.5,
				minimum: 0,
				maximum: 1
			}
		});
		this.addInput('y1', {
			type: {
				...NumberSchema,
				default: 0,
				minimum: 0,
				maximum: 1
			}
		});
		this.addInput('x2', {
			type: {
				...NumberSchema,
				default: 0.5,
				minimum: 0,
				maximum: 1
			}
		});
		this.addInput('y2', {
			type: {
				...NumberSchema,
				default: 1,
				minimum: 0,
				maximum: 1
			}
		});

		this.addOutput('curve', {
			type: CurveSchema
		});
	}

	execute(): void | Promise<void> {
		const { x1, y1, x2, y2 } = this.getAllInputs();

		const curve: Curve = {
			curves: [
				{
					type: 'bezier',
					points: [
						[0, 0], // Start point
						[x1, y1], // First control point
						[x2, y2], // Second control point
						[1, 1] // End point
					]
				}
			]
		};

		this.outputs.curve.set(curve);
	}
}
