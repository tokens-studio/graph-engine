import { INodeDefinition, Node } from '@tokens-studio/graph-engine';
import { IResolvedToken, flatTokensToMap } from '../utils/index.js';
import { TokenSchema, TokenSetSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class ArrayToSetNode extends Node {
	static title = 'Token array to set';
	static type = 'studio.tokens.design.arrayToSet';
	static description = 'Converts an array of tokens to a set';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('tokens', {
			type: arrayOf(TokenSchema),
			visible: true
		});
		this.addOutput('value', {
			type: TokenSetSchema,
			visible: true
		});
	}

	execute(): void | Promise<void> {
		const tokens = this.getInput('tokens');

		const asSet = flatTokensToMap(tokens as IResolvedToken[]);

		this.setOutput('value', asSet);
	}
}
