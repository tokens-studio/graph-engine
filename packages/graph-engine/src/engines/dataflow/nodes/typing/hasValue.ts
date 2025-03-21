import { AnySchema, BooleanSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';

export default class NodeDefinition<T> extends DataflowNode {
	static title = 'Has Value';
	static type = 'studio.tokens.typing.hasValue';
	static description =
		'Checks if a value is defined. Returns true if undefined or null.';

	declare inputs: ToInput<{
		value: T;
	}>;
	declare outputs: ToOutput<{
		undefined: boolean;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: AnySchema
		});

		this.addOutput('undefined', {
			type: BooleanSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();
		this.outputs.undefined.set(value === null || value === undefined);
	}
}
