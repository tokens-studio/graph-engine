import {
	AnyArraySchema,
	AnySchema,
	NumberSchema
} from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Replace Item';
	static type = 'studio.tokens.array.replace';
	static description = 'Replaces an item in an array at a specified index.';

	declare inputs: ToInput<{
		array: T[];
		item: T;
		index: number;
	}>;

	declare outputs: ToOutput<{
		array: T[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('array', {
			type: AnyArraySchema
		});
		this.addInput('item', {
			type: AnySchema
		});
		this.addInput('index', {
			type: NumberSchema
		});
		this.addOutput('array', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const { item, index, array } = this.getAllInputs();
		const arrayType = this.inputs.array.type;
		this.inputs.item.setType(arrayType.items);

		// Create a copy of the array value
		const result = [...array];

		if (index >= 0 && index < result.length) {
			result[index] = item;
		} else if (index < 0 && Math.abs(index) <= result.length) {
			// Handle negative indices by counting from the end
			const actualIndex = result.length + index;
			result[actualIndex] = item;
		}

		// Set the output using the modified result and the original array type
		this.outputs.array.set(result, arrayType);
	}
}
