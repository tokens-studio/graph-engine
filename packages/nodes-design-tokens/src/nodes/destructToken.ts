import {
	INodeDefinition,
	Node,
	ObjectSchema,
	StringSchema,
	ToOutput
} from '@tokens-studio/graph-engine';
import {
	TokenBorderSchema,
	TokenBoxShadowSchema,
	TokenSchema,
	TokenTypographySchema
} from '../schemas/index.js';
import { type TokenBorderValue, TokenTypes } from '@tokens-studio/types';
import { arrayOf } from 'src/schemas/utils.js';

export default class CreateBorderNode extends Node {
	static title = 'Destruct token';
	static type = 'studio.tokens.design.destruct';
	static description = 'Breaks down a token into its parts';

	declare outputs: ToOutput<{
		token: TokenBorderValue;
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
		this.addOutput('$extension', {
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

		const { name, description, type, $extensions, value } = token;
		this.setOutput('name', name);
		this.setOutput('description', description);
		this.setOutput('type', type);
		this.setOutput('$extensions', $extensions);

		//Make sure to reset all the values
		this.setOutput('value', undefined);
		this.setOutput('border', undefined);
		this.setOutput('typography', undefined);
		this.setOutput('boxShadow', undefined);

		switch (type) {
			case TokenTypes.BORDER:
				this.setOutput(typeof value === 'object' ? 'border' : 'value', value);
				break;
			case TokenTypes.BOX_SHADOW:
				this.setOutput(
					typeof value === 'object' ? 'boxShadow' : 'value',
					value
				);
				break;
			case TokenTypes.TYPOGRAPHY:
				this.setOutput(
					typeof value === 'object' ? 'typography' : 'value',
					value
				);
				break;
			default:
				this.setOutput('value', value);
		}
	}
}
