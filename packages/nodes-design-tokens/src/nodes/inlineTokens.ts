import {
	DataflowNode,
	INodeDefinition,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import type { SingleToken } from '@tokens-studio/types';

export default class InlineTokenNode extends DataflowNode {
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
		this.dataflow.addInput('value', {
			type: arrayOf(TokenSchema),
			visible: false
		});
		this.dataflow.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const value = this.inputs.value.value;
		this.outputs.tokens.set(value);
	}
}
