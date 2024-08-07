import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { StringSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Regex';
	static type = 'studio.tokens.string.regex';
	static description = 'Replaces a string with a regex';

	declare inputs: ToInput<{
		input: string;
		/**
		 * The matching string. You do not need to include the slashes
		 */
		match: string;
		flags: string;
		replace: string;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('input', {
			type: StringSchema
		});
		this.dataflow.addInput('match', {
			type: {
				...StringSchema,
				default: ''
			}
		});
		this.dataflow.addInput('flags', {
			type: {
				...StringSchema,
				default: ''
			}
		});
		this.dataflow.addInput('replace', {
			type: {
				...StringSchema,
				default: ''
			}
		});
		this.dataflow.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { input, match, flags, replace } = this.getAllInputs();
		const regex = new RegExp(match, flags);
		const output = input.replace(regex, replace);

		this.outputs.value.set(output);
	}
}
