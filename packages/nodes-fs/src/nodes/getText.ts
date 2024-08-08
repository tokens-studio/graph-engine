import {
	DataflowNode,
	INodeDefinition,
	StringSchema
} from '@tokens-studio/graph-engine';
import { FileSchema } from '../schemas/index.js';
import type { ToInput } from '@tokens-studio/graph-engine';

export class GetTextNode extends DataflowNode {
	static title = 'Read file as text';
	static type = 'studio.tokens.fs.getText';

	declare inputs: ToInput<{
		file: Uint8Array;
	}>;
	static description = 'Reads the text context of a file from the file system.';
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('file', {
			type: FileSchema
		});

		this.dataflow.addOutput('contents', {
			type: StringSchema
		});
	}

	async execute() {
		const { file } = this.getAllInputs();

		const contents = new TextDecoder().decode(file);

		this.outputs.contents.set(contents);
	}
}
