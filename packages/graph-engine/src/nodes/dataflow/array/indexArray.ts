import {
	AnyArraySchema,
	AnySchema,
	NumberSchema
} from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import type { SchemaObject } from 'ajv';
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Index Array';
	static type = 'studio.tokens.array.index';
	static description = 'Extracts a value from an array at a given index. ';

	declare inputs: ToInput<{
		/**
		 * The array to extract the value from
		 */
		array: T[];
		/**
		 * The index to extract the value from.
		 * @default 0
		 */
		index: number;
	}>;
	declare outputs: ToOutput<{
		/**
		 * The value at the given index
		 */
		value: T;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('array', {
			type: AnyArraySchema
		});
		this.addInput('index', {
			type: {
				...NumberSchema,
				default: 0
			}
		});

		this.addOutput('value', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const array = this.inputs.array;
		const { index } = this.getAllInputs();
		//Get the value
		const calculated = array.value[index];
		//Extract the type
		//We assume that the array has a single defined item

		// Infer the item type from the array schema
		let itemType: SchemaObject = AnySchema;
		if (array.type && array.type.items) {
			itemType = array.type.items as SchemaObject;
		}

		this.outputs.value.set(calculated, itemType);
	}
}
