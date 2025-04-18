import {
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class ExternalTokensNode extends Node {
	static title = 'External Token Set';
	static type = 'studio.tokens.design.externalSet';
	static description =
		'Retrieves an external set of tokens and then exposes them';

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('uri', {
			type: StringSchema
		});
		this.addOutput('tokenSet', {
			type: arrayOf(TokenSchema)
		});
	}

	async execute() {
		const { uri } = this.getAllInputs();

		if (!uri) {
			this.outputs.tokenSet.set([]);
			return;
		}

		const tokens = await this.load(uri);
		this.outputs.tokenSet.set(tokens);
	}
}
