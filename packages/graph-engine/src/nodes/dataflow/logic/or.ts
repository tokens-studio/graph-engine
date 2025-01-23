import {
	AnySchema,
	BooleanSchema,
	createVariadicSchema
} from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition<T = any> extends DataflowNode {
	static title = 'Logical or';
	static type = 'studio.tokens.logic.or';
	static description = 'OR node allows you to check if all inputs are true.';

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
		this.dataflow.addOutput('value', {
			type: BooleanSchema
		});
	}

	execute(): void | Promise<void> {
		const inputs = this.inputs.inputs.value;
		const output = inputs.reduce((acc, curr) => acc || !!curr, false);
		this.outputs.value.set(output);
	}
}
