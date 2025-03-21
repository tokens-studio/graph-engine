import {
	DataflowNode,
	INodeDefinition,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import type { SingleToken } from '@tokens-studio/types';

export default class NameTokensNode extends DataflowNode {
	static title = 'Name tokens';
	static type = 'studio.tokens.design.nameTokens';
	static description = 'Names an array of tokens by their index';

	declare inputs: ToInput<{
		tokens: SingleToken[];
	}>;

	declare outputs: ToOutput<{
		tokens: SingleToken[];
	}>;

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

		this.outputs.tokens.set(renamed);
	}
}
