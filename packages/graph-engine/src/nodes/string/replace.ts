import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { StringSchema } from '../../schemas/index.js';

/**
 * This node replaces all occurrences of a search string with a replacement string
 */
export default class NodeDefinition extends Node {
	static title = 'Replace';
	static type = 'studio.tokens.string.replace';
	static description =
		'Replaces all occurrences of a search string with a replacement string';

	declare inputs: ToInput<{
		string: string;
		search: string;
		replace: string;
	}>;
	declare outputs: ToOutput<{
		string: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('string', {
			type: StringSchema
		});
		this.addInput('search', {
			type: StringSchema
		});
		this.addInput('replace', {
			type: {
				...StringSchema,
				default: ''
			}
		});
		this.addOutput('string', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { string, search, replace } = this.getAllInputs();
		const result = string.split(search).join(replace);
		this.outputs.string.set(result);
	}
}
