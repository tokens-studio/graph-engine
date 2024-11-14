import { AnyArraySchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Array Length';
	static type = 'studio.tokens.array.length';
	static description = 'Determines the length of an array.';

	declare inputs: ToInput<{
		array: T[];
	}>;

	declare outputs: ToOutput<{
		length: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('array', {
			type: AnyArraySchema
		});
		this.addOutput('length', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { array } = this.getAllInputs();

		this.outputs.length.set(array.length);
	}
}
