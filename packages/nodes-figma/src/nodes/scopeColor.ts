import {
	BooleanSchema,
	INodeDefinition,
	Node,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { FigmaScope } from '../types/scopes.js';
import { SingleToken } from '@tokens-studio/types';
import { TokenSchema } from '@tokens-studio/graph-engine-nodes-design-tokens/schemas/index.js';
import { mergeTokenExtensions } from '../utils/tokenMerge.js';

export default class NodeDefinition extends Node {
	static title = 'Scope Color';
	static type = 'studio.tokens.figma.scopeColor';
	static description = 'Defines color variable scopes for Figma';

	declare inputs: ToInput<{
		token: SingleToken;
		allFills: boolean;
		effects: boolean;
		frameFill: boolean;
		shapeFill: boolean;
		stroke: boolean;
		textFill: boolean;
	}>;
	declare outputs: ToOutput<{
		token: SingleToken;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('token', {
			type: {
				...TokenSchema,
				description: 'The design token to add scopes to'
			}
		});

		this.addInput('allFills', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include all fills scope'
			}
		});

		this.addInput('effects', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include effects scope'
			}
		});

		this.addInput('frameFill', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include frame fill scope'
			}
		});

		this.addInput('shapeFill', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include shape fill scope'
			}
		});

		this.addInput('stroke', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include stroke scope'
			}
		});

		this.addInput('textFill', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include text fill scope'
			}
		});

		this.addOutput('token', {
			type: TokenSchema
		});
	}

	execute(): void | Promise<void> {
		const inputs = this.getAllInputs();
		const newScopes: FigmaScope[] = [];

		// Map inputs to corresponding scopes
		if (inputs.allFills) newScopes.push('ALL_FILLS');
		if (inputs.effects) newScopes.push('EFFECT_COLOR');
		if (inputs.frameFill) newScopes.push('FRAME_FILL');
		if (inputs.shapeFill) newScopes.push('SHAPE_FILL');
		if (inputs.stroke) newScopes.push('STROKE_COLOR');
		if (inputs.textFill) newScopes.push('TEXT_FILL');

		const modifiedToken = mergeTokenExtensions(inputs.token, {
			scopes: newScopes
		});

		this.outputs.token.set(modifiedToken);
	}
}
