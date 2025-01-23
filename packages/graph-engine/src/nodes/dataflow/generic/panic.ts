import { AnySchema } from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../../index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Panic';
	static type = 'studio.tokens.generic.panic';
	static description = 'Panics if passed a truthy value';

	declare inputs: ToInput<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		trigger: any;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('trigger', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const { trigger } = this.getAllInputs();

		if (trigger) {
			throw new Error(`Panic! Received ${trigger}`);
		}
	}
}
