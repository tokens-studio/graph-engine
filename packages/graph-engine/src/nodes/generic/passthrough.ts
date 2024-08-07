import { AnySchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Passthrough';
	static type = 'studio.tokens.generic.passthrough';
	static description = 'Passes a value through to the output';

	declare inputs: ToInput<{
		value: T;
	}>;
	declare outputs: ToOutput<{
		value: T;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('value', {
			type: AnySchema
		});
		this.dataflow.addOutput('value', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const input = this.inputs.value;
		this.outputs.value.set(input.value, input.type);
	}
}
