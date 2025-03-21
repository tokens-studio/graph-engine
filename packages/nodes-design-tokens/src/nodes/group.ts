import {
	DataflowNode,
	INodeDefinition,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenSetSchema } from '../schemas/index.js';
import type { DeepKeyTokenMap } from '@tokens-studio/types';

export default class GroupNode extends DataflowNode {
	static title = 'Group tokens';
	static type = 'studio.tokens.design.group';
	static description = 'Groups tokens by adding a namespace';

	declare inputs: ToInput<{
		name: string;
		tokenSet: DeepKeyTokenMap;
	}>;

	declare outputs: ToOutput<{
		tokenSet: DeepKeyTokenMap;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema
		});
		this.addInput('tokenSet', {
			type: TokenSetSchema
		});
		this.addOutput('tokenSet', {
			type: TokenSetSchema
		});
	}

	execute(): void | Promise<void> {
		const { name, tokenSet } = this.getAllInputs();
		const output = { [name]: tokenSet };

		this.outputs.tokenSet.set(output);
	}
}
