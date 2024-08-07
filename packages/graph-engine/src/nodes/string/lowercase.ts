import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { StringSchema } from '../../schemas/index.js';

/**
 * This node converts a string to lowercase
 */
export default class NodeDefinition extends DataflowNode {
	static title = 'Lowercase';
	static type = 'studio.tokens.string.lowercase';
	static description = 'Converts a string to lowercase';

	declare inputs: ToInput<{
		value: string;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('value', {
			type: StringSchema
		});
		this.dataflow.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();
		this.outputs.value.set(value.toLowerCase());
	}
}
