import {
	INodeDefinition,
	Node,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import type { SingleToken } from '@tokens-studio/types';

export default class GroupArrayNode extends Node {
	static title = 'Group token array';
	static type = 'studio.tokens.design.array.group';
	static description = 'Groups an array of tokens by adding a namespace';

	declare inputs: ToInput<{
		name: string;
		tokens: SingleToken[];
	}>;

	declare outputs: ToOutput<{
		tokens: SingleToken[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema
		});
		this.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
		this.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const { name, tokens } = this.getAllInputs();
		const output = tokens.map(token => ({
			...token,
			name: `${name}.${token.name}`
		}));

		this.outputs.tokens.set(output);
	}
}
