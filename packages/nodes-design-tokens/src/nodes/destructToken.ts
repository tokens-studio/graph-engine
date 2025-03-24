import {
	INodeDefinition,
	Node,
	ObjectSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import {
	TokenBorderSchema,
	TokenBoxShadowSchema,
	TokenSchema,
	TokenTypographySchema
} from '../schemas/index.js';
import { TokenTypes } from '@tokens-studio/types';
import { arrayOf } from '../schemas/utils.js';
import type {
	SingleToken,
	TokenBorderValue,
	TokenBoxshadowValue,
	TokenTypographyValue
} from '@tokens-studio/types';

export default class CreateBorderNode extends Node {
	static title = 'Deconstruct token';
	static type = 'studio.tokens.design.destruct';
	static description = 'Breaks down a token into its parts';

	declare inputs: ToInput<{
		token: SingleToken;
	}>;

	declare outputs: ToOutput<{
		name: string;
		description: string | undefined;
		type: string;
		$extensions: Record<string, unknown> | undefined;
		value: string | undefined;
		border: TokenBorderValue | undefined;
		typography: TokenTypographyValue | undefined;
		boxShadow: TokenBoxshadowValue[] | undefined;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('token', {
			type: TokenSchema
		});

		this.addOutput('name', {
			type: StringSchema
		});
		this.addOutput('description', {
			type: StringSchema
		});
		this.addOutput('type', {
			type: StringSchema
		});
		this.addOutput('$extensions', {
			type: ObjectSchema
		});

		this.addOutput('value', {
			type: StringSchema
		});

		this.addOutput('border', {
			type: TokenBorderSchema
		});
		this.addOutput('typography', {
			type: TokenTypographySchema
		});
		this.addOutput('boxShadow', {
			type: arrayOf(TokenBoxShadowSchema)
		});
	}

	execute(): void | Promise<void> {
		const { token } = this.getAllInputs();
		const outputs = this.outputs;

		const { name, description, type, $extensions, value } = token;
		outputs.name.set(name);
		outputs.description.set(description);
		outputs.type.set(type!);
		outputs.$extensions.set($extensions);

		//Make sure to reset all the values
		outputs.value.set(undefined);
		outputs.border.set(undefined);
		outputs.typography.set(undefined);
		outputs.boxShadow.set(undefined);

		switch (type) {
			case TokenTypes.BORDER:
				if (typeof value === 'object') {
					outputs.border.set(value as TokenBorderValue);
				} else {
					outputs.value.set(value);
				}
				break;
			case TokenTypes.BOX_SHADOW:
				if (typeof value === 'object') {
					outputs.boxShadow.set(value as TokenBoxshadowValue[]);
				} else {
					outputs.value.set(value);
				}
				break;
			case TokenTypes.TYPOGRAPHY:
				if (typeof value === 'object') {
					outputs.typography.set(value as TokenTypographyValue);
				} else {
					outputs.value.set(value);
				}
				break;
			default:
				this.outputs.value.set(value as string);
		}
	}
}
