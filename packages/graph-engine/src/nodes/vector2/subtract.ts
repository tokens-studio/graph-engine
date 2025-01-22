import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { Vec2 } from '../../index.js';
import { Vec2Schema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Subtract Vector2';
	static type = 'studio.tokens.vector2.subtract';
	static description = 'Subtracts second vector from first vector';

	declare inputs: ToInput<{
		a: Vec2;
		b: Vec2;
	}>;

	declare outputs: ToOutput<{
		value: Vec2;
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
			type: Vec2Schema
		});
	}

	execute(): void | Promise<void> {
		const { a, b } = this.getAllInputs();
		this.outputs.value.set([a[0] - b[0], a[1] - b[1]]);
	}
}
