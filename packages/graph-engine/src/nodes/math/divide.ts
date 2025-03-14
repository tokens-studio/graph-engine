import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Divide';
	static type = 'studio.tokens.math.divide';
	static description = 'Divide node allows you to divide two numbers.';
	declare inputs: ToInput<{
		a: number;
		b: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('a', {
			type: NumberSchema
		});
		this.addInput('b', {
			type: NumberSchema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b } = this.getAllInputs();
		this.outputs.value.set(a / b);
	}
}
