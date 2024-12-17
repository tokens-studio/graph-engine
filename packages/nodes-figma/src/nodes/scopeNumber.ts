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
	static title = 'Scope Number';
	static type = 'studio.tokens.figma.scopeNumber';
	static description = 'Defines number/float variable scopes for Figma';

	declare inputs: ToInput<{
		token: SingleToken;
		gapBetween: boolean;
		padding: boolean;
		cornerRadius: boolean;
		fontProperties: boolean;
		fontWeight: boolean;
		fontSize: boolean;
		lineHeight: boolean;
		letterSpacing: boolean;
		paragraphSpacing: boolean;
		paragraphIndent: boolean;
		layerOpacity: boolean;
		effects: boolean;
		stroke: boolean;
		textContent: boolean;
		widthAndHeight: boolean;
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

		this.addInput('gapBetween', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include gap between scope'
			}
		});

		this.addInput('padding', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include padding scope'
			}
		});

		this.addInput('cornerRadius', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include corner radius scope'
			}
		});

		this.addInput('fontWeight', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include font weight scope'
			}
		});

		this.addInput('fontSize', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include font size scope'
			}
		});

		this.addInput('lineHeight', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include line height scope'
			}
		});

		this.addInput('letterSpacing', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include letter spacing scope'
			}
		});

		this.addInput('paragraphSpacing', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include paragraph spacing scope'
			}
		});

		this.addInput('paragraphIndent', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include paragraph indent scope'
			}
		});

		this.addInput('layerOpacity', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include layer opacity scope'
			}
		});

		this.addInput('effects', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include effects scope'
			}
		});

		this.addInput('stroke', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include stroke scope'
			}
		});

		this.addInput('textContent', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include text content scope'
			}
		});

		this.addInput('widthAndHeight', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Include width and height scope'
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
		if (inputs.gapBetween) newScopes.push('GAP');
		if (inputs.cornerRadius) newScopes.push('CORNER_RADIUS');
		if (inputs.widthAndHeight) newScopes.push('WIDTH_HEIGHT');
		if (inputs.layerOpacity) newScopes.push('OPACITY');
		if (inputs.effects) newScopes.push('EFFECT_FLOAT');
		if (inputs.stroke) newScopes.push('STROKE_FLOAT');
		if (inputs.textContent) newScopes.push('TEXT_CONTENT');
		if (inputs.fontWeight) newScopes.push('FONT_WEIGHT');
		if (inputs.fontSize) newScopes.push('FONT_SIZE');
		if (inputs.lineHeight) newScopes.push('LINE_HEIGHT');
		if (inputs.letterSpacing) newScopes.push('LETTER_SPACING');
		if (inputs.paragraphSpacing) newScopes.push('PARAGRAPH_SPACING');
		if (inputs.paragraphIndent) newScopes.push('PARAGRAPH_INDENT');

		const modifiedToken = mergeTokenExtensions(inputs.token, {
			scopes: newScopes
		});

		this.outputs.token.set(modifiedToken);
	}
}
