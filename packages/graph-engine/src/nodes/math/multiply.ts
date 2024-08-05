import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Multiply';
	static type = 'studio.tokens.math.multiply';
	static description = 'Multiply node allows you to multiply two  numbers.';

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
		this.outputs.value.set(a * b);
	}
}
