import {
	DataflowNode,
	INodeDefinition,
	StringSchema
} from '@tokens-studio/graph-engine';
import { FSCapability } from '../capability/fs.js';
import { arrayOf } from '../schemas/utils.js';
import type { ToInput } from '@tokens-studio/graph-engine';

export class GetDirectoryNode extends DataflowNode {
	static title = 'Read directory';
	static type = 'studio.tokens.fs.getDirectory';

	declare inputs: ToInput<{
		path: string;
	}>;
	static description = 'Reads the directory of a path';
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('path', {
			type: StringSchema
		});

		this.dataflow.addOutput('files', {
			type: arrayOf(StringSchema)
		});
		this.dataflow.addOutput('dirs', {
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

		this.outputs.dirs.set(dirs);
		this.outputs.files.set(files);
	}
}
