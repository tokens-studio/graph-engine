import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Ceil';
	static type = 'studio.tokens.math.ceil';
	static description =
		'Ceil node allows you to adjusts a floating-point number to the nearest higher integer.';

	declare inputs: ToInput<{
		value: number;
	}>;

	declare outputs: ToOutput<{
		value: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: NumberSchema
		});

		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();

		this.outputs.value.set(Math.ceil(value));
	}
}
