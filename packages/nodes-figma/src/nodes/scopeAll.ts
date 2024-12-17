import {
	INodeDefinition,
	Node,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { TokenSchema } from '@tokens-studio/graph-engine-nodes-design-tokens/schemas/index.js';
import { mergeTokenExtensions } from '../utils/tokenMerge.js';

export default class NodeDefinition extends Node {
	static title = 'Scope All';
	static type = 'studio.tokens.figma.scopeAll';
	static description = 'Adds ALL_SCOPES scope to a Figma token';

	declare inputs: ToInput<{
		token: SingleToken;
	}>;
	declare outputs: ToOutput<{
		token: SingleToken;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('token', {
			type: {
				...TokenSchema,
				description: 'The design token to add ALL_SCOPES to'
			}
		});

		this.addOutput('token', {
			type: TokenSchema
		});
	}

	execute(): void | Promise<void> {
		const inputs = this.getAllInputs();
		const newScopes = ['ALL_SCOPES'];

		const modifiedToken = mergeTokenExtensions(inputs.token, {
			scopes: newScopes
		});

		this.outputs.token.set(modifiedToken);
	}
}
