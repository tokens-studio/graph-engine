import {
	DataflowNode,
	INodeDefinition,
	ObjectSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenBoxShadowSchema, TokenSchema } from '../schemas/index.js';
import { TokenTypes } from '@tokens-studio/types';
import { arrayOf } from '../schemas/utils.js';
import type {
	SingleBoxShadowToken,
	SingleToken,
	TokenBoxshadowValue
} from '@tokens-studio/types';

export default class NodeDefinition extends DataflowNode {
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
		this.dataflow.addInput('name', {
			type: StringSchema
		});

		this.dataflow.addInput('reference', {
			type: StringSchema
		});

		this.dataflow.addInput('value', {
			type: arrayOf(TokenBoxShadowSchema)
		});

		this.dataflow.addInput('description', {
			type: StringSchema
		});

		this.dataflow.addInput('$extensions', {
			type: {
				...ObjectSchema,
				default: undefined
			}
		});

		this.dataflow.addOutput('token', {
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
			value: [],
			description,
			$extensions
		} as SingleBoxShadowToken;

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
