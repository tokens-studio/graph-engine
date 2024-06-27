import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { StringSchema } from '../../schemas/index.js';

/**
 * This node converts a string to lowercase
 */
export default class NodeDefinition extends Node {
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
		this.addInput('value', {
			type: StringSchema
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();
		this.setOutput('value', value.toLowerCase());
	}
}
