import {
	INodeDefinition,
	Node,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenBorderSchema } from '../schemas/index.js';
import type { TokenBorderValue } from '@tokens-studio/types';

export default class CreateBorderNode extends Node {
	static title = 'Create a Border';
	static type = 'studio.tokens.design.createBorder';
	static description = 'Creates a composite Border value from inputs';

	declare inputs: ToInput<{
		color: string;
		width: string;
		style: string;
	}>;

	declare outputs: ToOutput<{
		token: TokenBorderValue;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: StringSchema
		});
		this.addInput('width', {
			type: StringSchema
		});
		this.addInput('style', {
			type: StringSchema
		});

		this.addOutput('value', {
			type: TokenBorderSchema
		});
	}

	execute(): void | Promise<void> {
		const props = this.getAllInputs();
		this.setOutput('value', props);
	}
}
