import { AnyArraySchema } from '../../schemas/index.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Array Difference';
	static type = 'studio.tokens.array.difference';
	static description =
		'Returns elements in first array that are not in second array';

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

		// Create set from second array for efficient lookup
		const setB = new Set(b);
		const difference = a.filter(item => !setB.has(item));

		this.outputs.value.set(difference, this.inputs.a.type);
	}
}
