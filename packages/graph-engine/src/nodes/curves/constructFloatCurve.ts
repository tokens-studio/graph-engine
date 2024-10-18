import { FloatCurve, INodeDefinition, ToInput, ToOutput, Vec2 } from '../../index.js';
import { FloatCurveSchema, Vec2Schema } from '../../schemas/index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition extends Node {
	static title = 'Construct Float Curve';
	static type = 'studio.tokens.curve.constructFloat';
	static description = 'Constructs a float curve from its parts';

	declare inputs: ToInput<{
		segments: Vec2[];
		controlPoints: [Vec2,Vec2][];

	}>;
	declare outputs: ToOutput<{
		curve: FloatCurve;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		
		this.addInput('segments', {
			type: {
				type: 'array',
				items: Vec2Schema
			}
		});
		this.addInput('controlPoints', {
			type: {
				type: 'array',
				items: {
					type: 'array',
					items: Vec2Schema
				}
			}
		});
		this.addOutput('curve', {
			type: FloatCurveSchema
		});
	}

	execute(): void | Promise<void> {
		const { segments, controlPoints } = this.getAllInputs();

		if (segments.length !== controlPoints.length + 1) {
			throw new Error('Segments must be one more than control points');
		}

		this.outputs.curve.set({
			controlPoints,
			segments
		});
	}
}
