import {
	DataflowNode,
	INodeDefinition,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class FlattenNode extends DataflowNode {
	static title = 'Flatten Token Sets';
	static type = 'studio.tokens.design.flatten';
	static description = 'Flattens a set of tokens';

	declare inputs: ToInput<{
		arrayOfTokens: SingleToken[][];
	}>;

	declare outputs: ToOutput<{
		tokens: SingleToken[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('arrayOfTokens', {
			type: {
				...arrayOf(arrayOf(TokenSchema)),
				default: []
			}
		});
		this.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const { arrayOfTokens } = this.getAllInputs();

		const { vals } = (arrayOfTokens as SingleToken[][])
			.flat()
			.flat()
			.reduceRight(
				(acc, val: SingleToken) => {
					if (acc.lookup[val.name]) {
						return acc;
					}
					//Must be the first time we've seen this key
					acc.lookup[val.name] = true;
					acc.vals.push(val);
					return acc;
				},
				{
					vals: [] as SingleToken[],
					lookup: {}
				}
			);
		this.outputs.tokens.set(vals.reverse());
	}
}
