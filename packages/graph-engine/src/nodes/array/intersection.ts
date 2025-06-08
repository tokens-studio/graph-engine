import { AnyArraySchema } from '../../schemas/index.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Array Intersection';
	static type = 'studio.tokens.array.intersection';
	static description = 'Returns common elements between two arrays';

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

		// Create sets for efficient lookup
		const setB = new Set(b);
		const intersection = a.filter(item => setB.has(item));

		this.outputs.value.set(intersection, this.inputs.a.type);
	}
}
