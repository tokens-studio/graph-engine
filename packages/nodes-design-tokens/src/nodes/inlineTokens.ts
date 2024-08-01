import {
	INodeDefinition,
	Node,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import type { SingleToken } from '@tokens-studio/types';

export default class InlineTokenNode extends Node {
	static title = 'Inline Tokens';
	static type = 'studio.tokens.design.inline';
	static description =
		'Creates a set of tokens and stores it directly in the graph';

	declare inputs: ToInput<{
		value: SingleToken[];
	}>;

	declare outputs: ToOutput<{
		tokens: SingleToken[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: arrayOf(TokenSchema),
			visible: false
		});
		this.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const value = this.getInput('value');
		this.setOutput('tokens', value);
	}
}
