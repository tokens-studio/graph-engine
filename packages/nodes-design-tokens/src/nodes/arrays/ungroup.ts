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

export default class UngroupArrayNode extends Node {
	static title = 'Ungroup token array';
	static type = 'studio.tokens.design.array.ungroup';
	static description =
		'Ungroups an array of tokens by removing their namespace';

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
		const prefix = `${name}.`;

		const output = tokens
			.filter(token => token.name.startsWith(prefix))
			.map(token => ({
				...token,
				name: token.name.slice(prefix.length)
			}));

		this.outputs.tokens.set(output);
	}
}
