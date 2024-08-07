import {
	BooleanSchema,
	DataflowNode,
	INodeDefinition,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class ExtractTokenNode extends DataflowNode {
	static title = 'Extract token ';
	static type = 'studio.tokens.design.extractToken';
	static description = 'Extracts a token from a token set';

	declare inputs: ToInput<{
		tokens: SingleToken[];
		name: string;
	}>;
	declare output: ToOutput<{
		found: boolean;
		token?: SingleToken;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
		this.dataflow.addInput('name', {
			type: StringSchema
		});
		this.dataflow.addOutput('found', {
			type: BooleanSchema
		});
		this.dataflow.addOutput('token', {
			type: TokenSchema
		});
	}

	async execute() {
		const { tokens, name } = this.getAllInputs();

		const token = tokens.find((token: SingleToken) => token.name === name);
		this.outputs.token.set(token);
		this.outputs.found.set(!!token);
	}
}
