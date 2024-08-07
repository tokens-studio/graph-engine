import { AnyArraySchema, StringSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../programmatic/nodes/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';
import { orderBy } from 'lodash-es';

export enum Order {
	ASC = 'asc',
	DESC = 'desc'
}

export type NamedInput = {
	array: any[];
	order?: Order.ASC | Order.DESC; // Optional parameter to specify the sort order
	sortBy?: string; // Optional parameter to specify the property to sort by
};

export const defaults = {
	order: Order.ASC
};
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Sort Array';
	static type = 'studio.tokens.array.sort';

	declare inputs: ToInput<{
		array: T[];
		order: Order;
		sortBy: string;
	}>;

	declare outputs: ToOutput<{
		value: T[];
	}>;

	static description = 'Sorts an array';
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('array', {
			type: AnyArraySchema
		});
		this.dataflow.addInput('order', {
			type: {
				...StringSchema,
				enum: [Order.ASC, Order.DESC],
				default: Order.ASC
			}
		});
		this.dataflow.addInput('sortBy', {
			type: StringSchema
		});
		this.dataflow.addOutput('value', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const { sortBy, order } = this.getAllInputs();
		const array = this.inputs.array;
		const sorted = orderBy(array.value, [sortBy], order);

		this.outputs.value.set(sorted, array.type);
	}
}
