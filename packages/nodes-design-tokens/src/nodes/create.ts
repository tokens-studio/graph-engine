import {
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import { ObjectSchema } from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { TokenTypes } from '@tokens-studio/types';

const excluded = [
	TokenTypes.TYPOGRAPHY,
	TokenTypes.BORDER,
	TokenTypes.BOX_SHADOW,
	TokenTypes.COMPOSITION
];
const types = Object.values(TokenTypes)
	.sort()
	.filter(x => !excluded.includes(x));

export default class NodeDefinition extends Node {
	static title = 'Create Design Token';
	static type = 'studio.tokens.design.create';
	static description = 'Creates a design token from inputs';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema
		});
		this.addInput('type', {
			type: {
				...StringSchema,
				enum: types
			}
		});
		this.addInput('value', {
			type: StringSchema
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
		const props = this.getAllInputs();
		const { name, type } = props;

		if (!name) {
			throw new Error('`name` is required');
		}

		if (!type) {
			throw new Error('Type is required');
		}

		this.setOutput('token', props);
	}
}
