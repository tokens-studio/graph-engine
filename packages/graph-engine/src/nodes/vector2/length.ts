import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, Vec2Schema } from '../../schemas/index.js';
import { Vec2 } from '../../index.js';

export default class NodeDefinition extends Node {
	static title = 'Vector2 Length';
	static type = 'studio.tokens.vector2.length';
	static description = 'Calculates the magnitude (length) of a 2D vector';

	declare inputs: ToInput<{
		vector: Vec2;
	}>;

	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('vector', {
			type: Vec2Schema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { vector } = this.getAllInputs();
		const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
		this.outputs.value.set(length);
	}
}
