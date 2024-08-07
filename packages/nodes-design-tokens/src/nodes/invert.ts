import {
	DataflowNode,
	INodeDefinition,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class InvertNode extends DataflowNode {
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
		this.dataflow.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
		this.dataflow.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const value = this.inputs.tokens.value;

		const inverted = value.map((x, i) => {
			const vals = inverted[inverted.length - i - 1];
			return {
				...vals,
				name: x.name
			};
		});

		this.outputs.tokens.set(value);
	}
}
