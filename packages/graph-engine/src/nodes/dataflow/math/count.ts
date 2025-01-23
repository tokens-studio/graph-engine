import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

import { AnyArraySchema, NumberSchema } from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Count';
	static type = 'studio.tokens.math.count';
	static description = 'Counts the amount of items in an array.';

	declare inputs: ToInput<{
		value: any[];
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: AnyArraySchema
		});
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		this.outputs.value.set(this.inputs.value.value.length);
	}
}
