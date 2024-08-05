import {
	INodeDefinition,
	Node,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenTypographySchema } from '../schemas/index.js';
import type { TokenTypographyValue } from '@tokens-studio/types';

export default class CreateTypographyNode extends Node {
	static title = 'Create a Typography';
	static type = 'studio.tokens.design.createTypography';
	static description = 'Creates a composite typography value from inputs';

	declare inputs: ToInput<{
		fontFamily?: string;
		fontWeight?: string;
		fontSize?: string;
		lineHeight?: string;
		letterSpacing?: string;
		paragraphSpacing?: string;
		textDecoration?: string;
		textCase?: string;
	}>;

	declare outputs: ToOutput<{
		token: TokenTypographyValue;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('fontFamily', {
			type: StringSchema
		});
		this.addInput('fontWeight', {
			type: StringSchema
		});
		this.addInput('fontSize', {
			type: StringSchema
		});

		this.addInput('lineHeight', {
			type: StringSchema
		});
		this.addInput('letterSpacing', {
			type: StringSchema
		});
		this.addInput('paragraphSpacing', {
			type: StringSchema
		});
		this.addInput('textDecoration', {
			type: StringSchema
		});
		this.addInput('textCase', {
			type: StringSchema
		});

		this.addOutput('value', {
			type: TokenTypographySchema
		});
	}

	execute(): void | Promise<void> {
		const props = this.getAllInputs();
		this.outputs.value.set(props);
	}
}
