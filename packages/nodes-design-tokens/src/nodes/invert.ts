import {
	INodeDefinition,
	Node,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { IResolvedToken } from '../utils/index.js';
import { SingleToken } from '@tokens-studio/types';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class InvertNode extends Node {
	static title = 'Invert Token Set';
	static type = 'studio.tokens.design.invert';
	static description = 'Inverts the order of a set of tokens';

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
		const value = this.getInput('tokens') as IResolvedToken[];

		const inverted = value.map((x, i) => {
			const vals = inverted[inverted.length - i - 1];
			return {
				...vals,
				name: x.name
			};
		});

		this.setOutput('tokens', value);
	}
}
