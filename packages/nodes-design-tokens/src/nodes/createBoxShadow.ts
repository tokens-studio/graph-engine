import {
	DataflowNode,
	INodeDefinition,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenBoxShadowSchema } from '../schemas/index.js';
import type { BoxShadowTypes, TokenBoxshadowValue } from '@tokens-studio/types';

export default class CreateBoxShadowNode extends DataflowNode {
	static title = 'Create a Box Shadow';
	static type = 'studio.tokens.design.createBoxShadow';
	static description = 'Creates a composite box shadow value from inputs';

	declare inputs: ToInput<{
		x: string;
		y: string;
		blur: string;
		spread: string;
		color: string;
		type: BoxShadowTypes;
		blendMode?: string;
	}>;

	declare outputs: ToOutput<{
		value: TokenBoxshadowValue;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('x', {
			type: StringSchema
		});
		this.addInput('y', {
			type: StringSchema
		});
		this.addInput('blur', {
			type: StringSchema
		});
		this.addInput('spread', {
			type: StringSchema
		});
		this.addInput('color', {
			type: StringSchema
		});
		this.addInput('type', {
			type: StringSchema
		});
		this.addInput('blendMode', {
			type: StringSchema
		});
		this.addOutput('value', {
			type: TokenBoxShadowSchema
		});
	}

	execute(): void | Promise<void> {
		const props = this.getAllInputs();
		this.outputs.value.set(props as TokenBoxshadowValue);
	}
}
