import { AnyArraySchema } from '../../schemas/index.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Array Union';
	static type = 'studio.tokens.array.union';
	static description = 'Combines two arrays and removes duplicates';

	declare inputs: ToInput<{
		a: T[];
		b: T[];
	}>;

	declare outputs: ToOutput<{
		value: T[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('a', {
			type: AnyArraySchema
		});
		this.addInput('b', {
			type: AnyArraySchema
		});
		this.addOutput('value', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b } = this.getAllInputs();

		//Verify types
		if (this.inputs.a.type.$id !== this.inputs.b.type.$id) {
			throw new Error('Array types must match');
		}

		// Combine arrays and remove duplicates using Set
		const union = [...new Set([...a, ...b])];

		this.outputs.value.set(union, this.inputs.a.type);
	}
}
