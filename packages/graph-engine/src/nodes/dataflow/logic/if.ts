import { AnySchema, BooleanSchema } from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition<T, V> extends DataflowNode {
	static title = 'If';
	static type = 'studio.tokens.logic.if';
	static description =
		'If node allows you to conditionally choose a value based on a condition.';

	declare inputs: ToInput<{
		condition: boolean;
		a: T;
		b: V;
	}>;

	declare outputs: ToOutput<{
		value: T | V;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('condition', {
			type: BooleanSchema
		});
		this.addInput('a', {
			type: AnySchema
		});
		this.addInput('b', {
			type: AnySchema
		});
		this.dataflow.addOutput('value', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const { condition } = this.getAllInputs();
		const a = this.inputs.a;
		const b = this.inputs.b;

		const val = condition ? a : b;

		this.outputs.value.set(val.value, val.type);
	}
}
