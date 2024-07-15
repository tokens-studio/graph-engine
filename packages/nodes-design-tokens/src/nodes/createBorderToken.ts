import {
	INodeDefinition,
	Node,
	ObjectSchema,
	StringSchema
} from '@tokens-studio/graph-engine';
import { TokenBorderSchema, TokenSchema } from '../schemas/index.js';
import { TokenTypes } from '@tokens-studio/types';
import { arrayOf } from 'src/schemas/utils.js';

export default class NodeDefinition extends Node {
	static title = 'Create Border Design Token';
	static type = 'studio.tokens.design.createBorderToken';
	static description = 'Creates a design token from inputs';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema
		});

		this.addInput('reference', {
			type: StringSchema
		});

		this.addInput('value', {
			type: arrayOf(TokenBorderSchema)
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

		this.setOutput('token', obj);
	}
}
