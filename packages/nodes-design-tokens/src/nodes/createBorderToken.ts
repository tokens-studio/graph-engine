import {
	DataflowNode,
	INodeDefinition,
	ObjectSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { TokenBorderSchema, TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';
import type {
	SingleToken,
	TokenBorderValue,
	TokenTypes
} from '@tokens-studio/types';

export default class NodeDefinition extends DataflowNode {
	static title = 'Create Border Design Token';
	static type = 'studio.tokens.design.createBorderToken';
	static description = 'Creates a design token from inputs';

	declare outputs: ToOutput<{
		token: SingleToken;
	}>;
	declare inputs: ToInput<{
		name: string;
		reference: string;
		value: TokenBorderValue[];
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
			type: arrayOf(TokenBorderSchema)
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
			type: TokenTypes.BORDER,
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
