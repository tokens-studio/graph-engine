import {
	AnyArraySchema,
	AnySchema,
	NumberSchema
} from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Inject Item';
	static type = 'studio.tokens.array.inject';
	static description = 'Injects an item into an array at a specified index.';

	declare inputs: ToInput<{
		array: T[];
		item: T;
		index: number;
	}>;

	declare outputs: ToOutput<{
		value: T[];
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
		const { item, index } = this.getAllInputs();
		const array = this.getRawInput('array');
		this.inputs.item.setType(array.type.items);

		// Create a copy of the array value
		const result = [...array.value];

		if (index >= 0) {
			result.splice(index, 0, item);
		} else {
			const insertIndex = Math.max(0, result.length + index + 1);
			result.splice(insertIndex, 0, item);
		}

		// Set the output using the modified result and the original array type
		this.setOutput('array', result, array.type);
	}
}
