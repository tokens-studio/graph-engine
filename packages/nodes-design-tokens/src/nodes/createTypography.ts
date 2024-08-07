import {
	DataflowNode,
	INodeDefinition,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenTypographySchema } from '../schemas/index.js';
import type { TokenTypographyValue } from '@tokens-studio/types';

export default class CreateTypographyNode extends DataflowNode {
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
		value: TokenTypographyValue;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('fontFamily', {
			type: StringSchema
		});
		this.dataflow.addInput('fontWeight', {
			type: StringSchema
		});
		this.dataflow.addInput('fontSize', {
			type: StringSchema
		});

		this.dataflow.addInput('lineHeight', {
			type: StringSchema
		});
		this.dataflow.addInput('letterSpacing', {
			type: StringSchema
		});
		this.dataflow.addInput('paragraphSpacing', {
			type: StringSchema
		});
		this.dataflow.addInput('textDecoration', {
			type: StringSchema
		});
		this.dataflow.addInput('textCase', {
			type: StringSchema
		});

		this.dataflow.addOutput('value', {
			type: TokenTypographySchema
		});
	}

	execute(): void | Promise<void> {
		const props = this.getAllInputs();
		this.outputs.value.set(props);
	}
}
