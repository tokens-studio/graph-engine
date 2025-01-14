import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { Vec2 } from '../../index.js';
import { Vec2Schema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Normalize Vector2';
	static type = 'studio.tokens.vector2.normalize';
	static description = 'Normalizes a vector to have a length of 1';

	declare inputs: ToInput<{
		vector: Vec2;
	}>;

	declare outputs: ToOutput<{
		value: Vec2;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('vector', {
			type: Vec2Schema
		});
		this.addOutput('value', {
			type: Vec2Schema
		});
	}

	execute(): void | Promise<void> {
		const { vector } = this.getAllInputs();
		const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

		if (length === 0) {
			// Handle zero vector case
			this.outputs.value.set([0, 0]);
			return;
		}

		this.outputs.value.set([vector[0] / length, vector[1] / length]);
	}
}
