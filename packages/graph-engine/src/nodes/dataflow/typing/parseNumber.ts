import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema, StringSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Parse Number';
	static type = 'studio.tokens.typing.parseNumber';
	static description = 'Converts a string to a number';

	declare inputs: ToInput<{
		value: string;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: StringSchema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();
		const parsed = Number(value);

		if (isNaN(parsed)) {
			throw new Error('Could not parse string to number');
		}

		this.outputs.value.set(parsed);
	}
}
