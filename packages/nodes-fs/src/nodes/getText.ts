import { FileSchema } from '../schemas/index.js';
import {
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import type { ToInput } from '@tokens-studio/graph-engine';

export class GetTextNode extends Node {
	static title = 'Read file as text';
	static type = 'studio.tokens.fs.getText';

	declare inputs: ToInput<{
		file: Uint8Array;
	}>;
	static description = 'Reads the text context of a file from the file system.';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('file', {
			type: FileSchema
		});

		this.addOutput('contents', {
			type: StringSchema
		});
	}

	async execute() {
		const { file } = this.getAllInputs();

		const contents = new TextDecoder().decode(file);

		this.outputs.contents.set(contents);
	}
}
