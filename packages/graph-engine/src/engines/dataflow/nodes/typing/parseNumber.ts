import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
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
