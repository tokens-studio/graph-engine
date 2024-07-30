import {
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import { TokenSetSchema } from '../schemas/index.js';

export default class GroupNode extends Node {
	static title = 'Group tokens';
	static type = 'studio.tokens.design.group';
	static description = 'Groups tokens by adding a namespace';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema
		});
		this.addInput('tokenSet', {
			type: TokenSetSchema
		});
		this.addOutput('tokenSet', {
			type: TokenSetSchema
		});
	}

	execute(): void | Promise<void> {
		const { name, tokenSet } = this.getAllInputs();
		const output = { [name]: tokenSet };

		this.setOutput('tokenSet', output);
	}
}
