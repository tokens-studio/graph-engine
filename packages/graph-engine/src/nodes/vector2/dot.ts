import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, Vec2Schema } from '../../schemas/index.js';
import { Vec2 } from '../../index.js';

export default class NodeDefinition extends Node {
	static title = 'Dot Product Vector2';
	static type = 'studio.tokens.vector2.dot';
	static description = 'Calculates the dot product of two 2D vectors';

	declare inputs: ToInput<{
		a: Vec2;
		b: Vec2;
	}>;

	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('a', {
			type: Vec2Schema
		});
		this.addInput('b', {
			type: Vec2Schema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b } = this.getAllInputs();
		const dotProduct = a[0] * b[0] + a[1] * b[1];
		this.outputs.value.set(dotProduct);
	}
}
