import { Node, StringSchema } from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class NearestColorNode extends Node {
	static title = 'Preview Typography';
	static type = 'studio.tokens.preview.typography';
	static description = 'Previews typographic tokens';

	constructor(props) {
		super(props);

		this.addInput('value', {
			type: arrayOf(TokenSchema),
			visible: true
		});
		this.addInput('text', {
			type: {
				...StringSchema,
				default: 'The quick brown fox jumps over the lazy dog'
			},
			visible: false
		});
	}
}
