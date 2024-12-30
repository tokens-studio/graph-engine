import { AnyArraySchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Remove Item';
	static type = 'studio.tokens.array.remove';
	static description =
		'Removes an item from an array at a specified index and returns both the modified array and the removed item.';

	declare inputs: ToInput<{
		array: T[];
		index: number;
	}>;

	declare outputs: ToOutput<{
		array: T[];
		item: T;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('array', {
			type: AnyArraySchema
		});
		this.addInput('index', {
			type: NumberSchema
		});
		this.addOutput('array', {
			type: AnyArraySchema
		});
		this.addOutput('item', {
			type: AnyArraySchema.items
		});
	}

	execute(): void | Promise<void> {
		const { index, array } = this.getAllInputs();
		const arrayType = this.inputs.array.type;

		// Create a copy of the array value
		const result = [...array];
		let removedItem: T | undefined;

		if (index >= 0 && index < result.length) {
			// Remove item at positive index
			[removedItem] = result.splice(index, 1);
		} else if (index < 0 && Math.abs(index) <= result.length) {
			// Handle negative indices by counting from the end
			const actualIndex = result.length + index;
			[removedItem] = result.splice(actualIndex, 1);
		}

		// Set the outputs
		this.outputs.array.set(result, arrayType);
		if (removedItem !== undefined) {
			this.outputs.item.set(removedItem, arrayType.items);
		}
	}
}
