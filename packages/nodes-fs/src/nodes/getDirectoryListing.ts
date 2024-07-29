import { FSCapability } from '../capability/fs.js';
import {
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import { arrayOf } from '../schemas/utils.js';
import type { ToInput } from '@tokens-studio/graph-engine';

type inputs = {
	path: string;
};

export class GetDirectoryNode extends Node {
	static title = 'Read directory';
	static type = 'studio.tokens.fs.getDirectory';

	declare inputs: ToInput<inputs>;
	static description = 'Reads the directory of a path';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('path', {
			type: StringSchema
		});

		this.addOutput('files', {
			type: arrayOf(StringSchema)
		});
		this.addOutput('dirs', {
			type: arrayOf(StringSchema)
		});
	}
	getFs(): FSCapability {
		return this.getGraph().capabilities['fs'];
	}
	async execute() {
		const { path } = this.getAllInputs();

		const fs = this.getFs();

		const fsEnts = await fs.readdir(path);

		const { dirs, files } = fsEnts.reduce(
			(acc, ent) => {
				if (ent.type === 'dir') {
					acc.dirs.push(ent.path);
				} else {
					acc.files.push(ent.path);
				}
				return acc;
			},
			{ dirs: [], files: [] }
		);

		this.setOutput('dirs', dirs);
		this.setOutput('files', files);
	}
}
