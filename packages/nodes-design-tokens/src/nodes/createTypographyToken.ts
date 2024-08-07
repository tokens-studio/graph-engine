import {
	DataflowNode,
	INodeDefinition,
	ObjectSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import {
	SingleTypographyToken,
	SingleTypographyToken,
	TokenTypes,
	TokenTypographyValue
} from '@tokens-studio/types';
import { TokenSchema, TokenTypographySchema } from '../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Create Typography Design Token';
	static type = 'studio.tokens.design.createTypographyToken';
	static description = 'Creates a design token from inputs';

	declare inputs: ToInput<{
		name: string;
		reference?: string;
		value?: TokenTypographyValue;
		description?: string;
		$extensions?: Record<string, unknown>;
	}>;

	declare outputs: ToOutput<{
		token: SingleTypographyToken;
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
			type: TokenTypographySchema
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
			type: TokenTypes.TYPOGRAPHY,
			value: '',
			description,
			$extensions
		} as SingleTypographyToken;

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
