import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, Vec2Schema } from '../../schemas/index.js';
import { Vec2 } from '../../index.js';

export default class NodeDefinition extends Node {
	static title = 'Scale Vector2';
	static type = 'studio.tokens.vector2.scale';
	static description = 'Multiplies a vector by a scalar value';

	declare inputs: ToInput<{
		vector: Vec2;
		scalar: number;
	}>;

	declare outputs: ToOutput<{
		value: Vec2;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('vector', {
			type: Vec2Schema
		});
		this.addInput('scalar', {
			type: { ...NumberSchema, default: 1 }
		});
		this.addOutput('value', {
			type: Vec2Schema
		});
	}

	execute(): void | Promise<void> {
		const { vector, scalar } = this.getAllInputs();
		this.outputs.value.set([vector[0] * scalar, vector[1] * scalar]);
	}
}
