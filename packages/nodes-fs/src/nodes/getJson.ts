import { FileSchema } from '../schemas/index.js';
import {
	INodeDefinition,
	Node,
	ObjectSchema
} from '@tokens-studio/graph-engine';
import type { ToInput } from '@tokens-studio/graph-engine';

export class GetJSONNode extends Node {
	static title = 'Read file as json';
	static type = 'studio.tokens.fs.getJson';

	declare inputs: ToInput<{
		file: Uint8Array;
	}>;
	static description =
		'Reads the context of a file from the file system as a JSON object.';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('file', {
			type: FileSchema
		});

		this.addOutput('contents', {
			type: ObjectSchema
		});
	}

	async execute() {
		const { file } = this.getAllInputs();

		const contents = JSON.parse(new TextDecoder().decode(file));

		this.outputs.contents.set(contents);
	}
}
