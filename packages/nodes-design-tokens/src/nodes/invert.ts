import {
	INodeDefinition,
	Node,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
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
		const value = this.inputs.tokens.value;
		const reversedValues = [...value].reverse();

		const inverted = value.map((x, i) => {
			return {
				...reversedValues[i],
				name: x.name
			};
		});

		this.outputs.tokens.set(inverted);
	}
}
