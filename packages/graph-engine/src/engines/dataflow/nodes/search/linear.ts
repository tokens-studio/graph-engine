import {
	AnyArraySchema,
	AnySchema,
	BooleanSchema,
	NumberSchema
} from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Linear Search';
	static type = 'studio.tokens.search.linear';
	static description =
		'Performs a linear search on an array to find the index of a target value';

	declare inputs: ToInput<{
		array: T[];
		target: T;
	}>;

	declare outputs: ToOutput<{
		index: number;
		found: boolean;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('array', {
			type: {
				...AnyArraySchema,
				description: 'The array to search through'
			}
		});

		this.addInput('target', {
			type: {
				...AnySchema,
				description: 'The value to search for'
			}
		});

		this.addOutput('index', {
			type: {
				...NumberSchema,
				description: 'The index of the target value (-1 if not found)'
			}
		});

		this.addOutput('found', {
			type: {
				...BooleanSchema,
				description: 'Whether the target value was found'
			}
		});
	}

	execute(): void | Promise<void> {
		const { array, target } = this.getAllInputs();

		if (!Array.isArray(array)) {
			throw new Error('Input must be an array');
		}

		const index = array.findIndex(
			item => JSON.stringify(item) === JSON.stringify(target)
		);

		this.outputs.index.set(index);
		this.outputs.found.set(index !== -1);
	}
}
