import { AnySchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition<T> extends Node {
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
		this.addInput('value', {
			type: AnySchema
		});
		this.addOutput('value', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const input = this.inputs.value;
		this.outputs.value.set(input.value, input.type);
	}
}
