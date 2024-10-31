import {
	FloatCurve,
	INodeDefinition,
	ToInput,
	ToOutput,
	Vec2
} from '../../index.js';
import { FloatCurveSchema, Vec2Schema } from '../../schemas/index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition extends Node {
	static title = 'Deconstruct Float Curve';
	static type = 'studio.tokens.curve.deconstructFloat';
	static description = 'Deconstructs a float curve into its parts';

	declare inputs: ToInput<{
		curve: FloatCurve;
	}>;
	declare outputs: ToOutput<{
		segments: Vec2[];
		controlPoints: Vec2[][];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('curve', {
			type: FloatCurveSchema
		});
		this.addOutput('segments', {
			type: {
				type: 'array',
				items: Vec2Schema
			}
		});
		this.addOutput('controlPoints', {
			type: {
				type: 'array',
				items: {
					type: 'array',
					items: Vec2Schema
				}
			}
		});
	}

	execute(): void | Promise<void> {
		const { curve } = this.getAllInputs();

		this.outputs.segments.set(curve.segments);
		this.outputs.controlPoints.set(curve.controlPoints);
	}
}
