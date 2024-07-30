import { INodeDefinition, Node } from '@tokens-studio/graph-engine';
import { IResolvedToken, flatTokensToMap } from '../utils/index.js';
import { TokenSchema, TokenSetSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class ArrayToSetNode extends Node {
	static title = 'Array of Tokens to Set';
	static type = 'studio.tokens.design.arrayToSet';
	static description = 'Converts an array of tokens to a set';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
		this.addOutput('tokenSet', {
			type: TokenSetSchema
		});
	}

	execute(): void | Promise<void> {
		const tokens = this.getInput('tokens');

		const asSet = flatTokensToMap(tokens as IResolvedToken[]);

		this.setOutput('tokenSet', asSet);
	}
}
