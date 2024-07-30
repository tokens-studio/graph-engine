import { INodeDefinition, Node } from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class NameTokensNode extends Node {
	static title = 'Name tokens';
	static type = 'studio.tokens.design.nameTokens';
	static description = 'Names an array of tokens by their index';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
		this.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const { tokens } = this.getAllInputs();

		const renamed = tokens.map((token, index) => {
			return {
				...token,
				name: `${(index + 1) * 100}`
			};
		});

		this.setOutput('tokens', renamed);
	}
}
