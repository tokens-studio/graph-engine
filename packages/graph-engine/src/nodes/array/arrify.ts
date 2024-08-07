import {
	AnyArraySchema,
	AnySchema,
	createVariadicSchema
} from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';

export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Arrify';
	static type = 'studio.tokens.array.arrify';
	static description =
		'Accepts a wide range of input types and formats, ensuring they are converted into a uniform array structure. The output is always an array.';

	declare inputs: ToInput<{
		items: T[];
	}>;
	declare outputs: ToOutput<{
		value: T[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('items', {
			type: {
				...createVariadicSchema(AnySchema),
				default: []
			},
			variadic: true
		});
		this.dataflow.addOutput('value', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const items = this.inputs.items;

		this.outputs.value.set(items.value, items.type);
	}
}
