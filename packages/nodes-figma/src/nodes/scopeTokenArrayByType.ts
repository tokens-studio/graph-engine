import {
	INodeDefinition,
	Node,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { SingleToken } from '@tokens-studio/types';
import { TokenSchema } from '@tokens-studio/graph-engine-nodes-design-tokens/schemas/index.js';
import { arrayOf } from '@tokens-studio/graph-engine-nodes-design-tokens/schemas/utils.js';
import { mergeTokenExtensions } from '../utils/tokenMerge.js';

export default class ScopeTokenArrayByType extends Node {
	static title = 'Scope Token Array by Type';
	static type = 'studio.tokens.figma.scopeTokenArrayByType';
	static description =
		'Automatically sets Figma scopes based on token type for an array of tokens';

	declare inputs: ToInput<{ tokens: SingleToken[] }>;
	declare outputs: ToOutput<{ tokens: SingleToken[] }>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
		this.addOutput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}

	// Reuse the same scopes mapping as the single token version
	getScopesByType = token => {
		switch (token.type) {
			case 'color':
				return ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'];
			case 'dimension':
				return [
					'GAP',
					'WIDTH_HEIGHT',
					'CORNER_RADIUS',
					'STROKE_FLOAT',
					'EFFECT_FLOAT',
					'PARAGRAPH_INDENT'
				];
			case 'spacing':
				return ['GAP', 'WIDTH_HEIGHT'];
			case 'borderRadius':
				return ['CORNER_RADIUS'];
			case 'fontFamilies':
				return ['FONT_FAMILY'];
			case 'fontWeights':
				return ['FONT_WEIGHT'];
			case 'fontSizes':
				return ['FONT_SIZE'];
			case 'lineHeights':
				return ['LINE_HEIGHT'];
			case 'letterSpacing':
				return ['LETTER_SPACING'];
			case 'paragraphSpacing':
				return ['PARAGRAPH_SPACING'];
			case 'opacity':
				return ['OPACITY'];
			case 'sizing':
				return ['WIDTH_HEIGHT'];
			default:
				return [];
		}
	};

	execute(): void | Promise<void> {
		const { tokens } = this.getAllInputs();

		const modifiedTokens = tokens.map((token: SingleToken) => {
			const newScopes = this.getScopesByType(token);
			return mergeTokenExtensions(token, { scopes: newScopes });
		});

		this.outputs.tokens.set(modifiedTokens);
	}
}
