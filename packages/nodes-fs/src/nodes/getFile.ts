import { FSCapability } from '../capability/fs.js';
import { FileSchema } from '../schemas/index.js';
import {
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import type { ToInput } from '@tokens-studio/graph-engine';

export class GetFileNode extends Node {
	static title = 'Get File';
	static type = 'studio.tokens.fs.getFile';

	declare inputs: ToInput<{
		path: string;
	}>;
	static description = 'Gets a file from the file system.';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('path', {
			type: StringSchema
		});

		this.addOutput('file', {
			type: FileSchema
		});

		this.addOutput('ext', {
			type: StringSchema
		});
	}
	getFs(): FSCapability {
		return this.getGraph().capabilities['fs'];
	}
	async execute() {
		const { path } = this.getAllInputs();

		const file = await this.getFs().readFile(path);

		this.outputs.file.set(file);
		this.outputs.ext.set(path.split('.').pop());
	}
}
