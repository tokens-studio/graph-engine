import {
	BooleanSchema,
	ColorSchema,
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { WcagVersion, sortTokens } from '../utils/sortTokens';
import { arrayOf } from '../schemas/utils.js';

export default class NearestColorNode extends Node {
	static title = 'Nearest tokens';
	static type = 'studio.tokens.design.nearestColor';
	static description = 'Sorts Token Set by distance to Color';
	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
		this.addInput('sourceColor', {
			type: {
				...ColorSchema,
				default: '#ffffff'
			}
		});
		this.addInput('compare', {
			type: {
				...StringSchema,
				default: 'Hue',
				enum: ['Contrast', 'Hue', 'Lightness', 'Saturation', 'Distance']
			}
		});
		this.addInput('inverted', {
			type: {
				...BooleanSchema,
				default: false
			}
		});
		this.addInput('wcag', {
			type: {
				...StringSchema,
				default: WcagVersion.V3,
				enum: Object.values(WcagVersion)
			}
		});

		this.addOutput('value', {
			type: arrayOf(TokenSchema)
		});
	}

	execute(): void | Promise<void> {
		const { tokens, sourceColor, compare, wcag, inverted } =
			this.getAllInputs();

		const sortedTokens = sortTokens(
			tokens,
			sourceColor,
			compare,
			wcag,
			inverted
		);

		this.setOutput('value', sortedTokens);
	}
}
