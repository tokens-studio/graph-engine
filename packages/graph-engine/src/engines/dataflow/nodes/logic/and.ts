import {
	AnySchema,
	BooleanSchema,
	createVariadicSchema
} from '../../schemas/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';

export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Logical and';
	static type = 'studio.tokens.logic.and';
	static description = 'AND node allows you to check if all inputs are true.';

	declare inputs: ToInput<{
		inputs: T[];
	}>;

	declare outputs: ToOutput<{
		value: boolean;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('inputs', {
			type: {
				...createVariadicSchema(AnySchema),
				default: []
			},
			variadic: true
		});
		this.addOutput('value', {
			type: BooleanSchema
		});
	}

	execute(): void | Promise<void> {
		const inputs = this.inputs.inputs.value;
		const output = inputs.reduce((acc, curr) => acc && !!curr, true);
		this.outputs.value.set(output);
	}
}
