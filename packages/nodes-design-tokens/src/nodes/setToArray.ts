import {
	DataflowNode,
	INodeDefinition,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenSchema, TokenSetSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import { flatten } from '../utils/index.js';
import type { DeepKeyTokenMap, SingleToken } from '@tokens-studio/types';

export default class SetToArrayNode extends DataflowNode {
	static title = 'Token set to token array ';
	static type = 'studio.tokens.design.setToArray';
	static description = 'Converts a token set to an array of tokens';

	declare inputs: ToInput<{
		tokenSet: DeepKeyTokenMap;
	}>;

	declare outputs: ToOutput<{
		tokens: SingleToken[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('tokenSet', {
			type: TokenSetSchema
		});
		this.dataflow.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const set = this.inputs.tokenSet.value;

		const tokens = flatten(set);

		this.outputs.tokens.set(tokens as SingleToken[]);
	}
}
