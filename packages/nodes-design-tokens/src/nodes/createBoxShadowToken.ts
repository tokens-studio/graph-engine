import {
	INodeDefinition,
	Node,
	ObjectSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenBoxShadowSchema, TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import type {
	SingleToken,
	TokenBoxshadowValue,
	TokenTypes
} from '@tokens-studio/types';

export default class NodeDefinition extends Node {
	static title = 'Create Box Shadow Design Token';
	static type = 'studio.tokens.design.createBoxShadowToken';
	static description = 'Creates a design token from inputs';

	declare outputs: ToOutput<{
		token: SingleToken;
	}>;

	declare inputs: ToInput<{
		name: string;
		reference: string;
		value: TokenBoxshadowValue[];
		description?: string;
		$extensions?: Record<string, unknown>;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema
		});

		this.addInput('reference', {
			type: StringSchema
		});

		this.addInput('value', {
			type: arrayOf(TokenBoxShadowSchema)
		});

		this.addInput('description', {
			type: StringSchema
		});

		this.addInput('$extensions', {
			type: {
				...ObjectSchema,
				default: undefined
			}
		});

		this.addOutput('token', {
			type: TokenSchema
		});
	}

	execute(): void | Promise<void> {
		const { name, reference, value, description, $extensions } =
			this.getAllInputs();
		if (!name) {
			throw new Error('`name` is required');
		}

		const obj = {
			name,
			type: TokenTypes.BOX_SHADOW,
			value: undefined,
			description,
			$extensions
		};

		if (value) {
			obj.value = value;
		} else if (reference) {
			obj.value = reference;
		} else {
			throw new Error('Value or reference is required');
		}

		this.outputs.token.set(obj);
	}
}
