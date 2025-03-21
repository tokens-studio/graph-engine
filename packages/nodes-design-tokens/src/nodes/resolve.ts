import {
	DataflowNode,
	INodeDefinition,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import {
	IResolvedToken,
	flatTokensRestoreToMap,
	flatten
} from '../utils/index.js';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import { transformTokens } from 'token-transformer';
import type { SingleToken } from '@tokens-studio/types';

const resolveValues = (tokens: IResolvedToken[], context: IResolvedToken[]) => {
	const setsToUse = ['root', 'excludes'];

	const rawTokens = {
		root: flatTokensRestoreToMap(tokens),
		excludes: flatTokensRestoreToMap(context)
	};

	//We don't want the modifiers to contribute to the final values
	const excludes = ['excludes'];

	const resolved = transformTokens(rawTokens, setsToUse, excludes, {
		expandTypography: false,
		expandShadow: false,
		expandComposition: true,
		preserveRawValue: false,
		throwErrorWhenNotResolved: false,
		resolveReferences: true
	});

	return flatten(resolved);
};

export default class ResolveNode extends DataflowNode {
	static title = 'Resolve tokens';
	static type = 'studio.tokens.design.resolve';
	static description = 'Resolves a set of tokens';

	declare inputs: ToInput<{
		inputs: SingleToken[][];
		context: SingleToken[][];
	}>;
	declare outputs: ToOutput<{
		value: IResolvedToken[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('inputs', {
			type: arrayOf(arrayOf(TokenSchema))
		});
		this.addInput('context', {
			type: arrayOf(arrayOf(TokenSchema))
		});
		this.addOutput('value', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const { inputs, context } = this.getAllInputs();

		const resolved = resolveValues(
			inputs.flat() as IResolvedToken[],
			context.flat() as IResolvedToken[]
		);
		this.outputs.value.set(resolved);
	}
}
