import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, Vec2Schema } from '../../schemas/index.js';
import { Vec2 } from '../../index.js';

export default class NodeDefinition extends Node {
	static title = 'Create vector2';
	static type = 'studio.tokens.vector2.create';
	static description = 'Allows you to create a vector2';

	declare inputs: ToInput<{
		x: number;
		y: string;
	}>;

	declare outputs: ToOutput<{
		value: Vec2;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('x', {
			type: NumberSchema
		});
		this.addInput('y', {
			type: NumberSchema
		});
		this.addOutput('value', {
			type: Vec2Schema
		});
	}

	execute(): void | Promise<void> {
		const { x, y } = this.getAllInputs();
		this.setOutput('value', [x, y]);
	}
}
