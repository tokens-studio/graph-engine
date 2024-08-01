import {
	INodeDefinition,
	Node,
	ObjectSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import {
	SingleToken,
	TokenTypes,
	TypographyValues
} from '@tokens-studio/types';
import { TokenSchema, TokenTypographySchema } from '../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Create Typography Design Token';
	static type = 'studio.tokens.design.createTypographyToken';
	static description = 'Creates a design token from inputs';

	declare inputs: ToInput<{
		name: string;
		reference?: string;
		value?: TypographyValues;
		description?: string;
		$extensions?: Record<string, unknown>;
	}>;

	declare outputs: ToOutput<{
		token: SingleToken;
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
			type: TokenTypographySchema
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
			type: TokenTypes.TYPOGRAPHY,
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
