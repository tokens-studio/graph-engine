import { AnySchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
export default class NodeDefinition extends Node {
	static title = 'Assert defined';
	static type = 'studio.tokens.typing.assertDefined';
	static description = 'Asserts that a value is defined';

	declare inputs: ToInput<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any;
	}>;
	declare outputs: ToOutput<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: AnySchema
		});
		this.addOutput('value', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const value = this.inputs.value;
		if (value.value === undefined) {
			throw new Error('Value is required');
		}
		this.outputs.value.set(value, value.type);
	}
}
