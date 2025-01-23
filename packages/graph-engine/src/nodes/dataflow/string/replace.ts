import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { StringSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

/**
 * This node replaces all occurrences of a search string with a replacement string
 */
export default class NodeDefinition extends DataflowNode {
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
