import {
	AnyArraySchema,
	AnySchema,
	NumberSchema
} from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Inject Item';
	static type = 'studio.tokens.array.inject';
	static description = 'Injects an item into an array at a specified index.';

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

		if (index >= 0) {
			result.splice(index, 0, item);
		} else {
			const insertIndex = Math.max(0, result.length + index + 1);
			result.splice(insertIndex, 0, item);
		}

		// Set the output using the modified result and the original array type
		this.outputs.array.set(result, arrayType);
	}
}
