import { DataflowNode, StringSchema } from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class NearestColorNode extends DataflowNode {
	static title = 'Preview Typography';
	static type = 'studio.tokens.preview.typography';
	static description = 'Previews typographic tokens';

	constructor(props) {
		super(props);

		this.dataflow.addInput('value', {
			type: arrayOf(TokenSchema)
		});
		this.dataflow.addInput('text', {
			type: {
				...StringSchema,
				default: 'The quick brown fox jumps over the lazy dog'
			},
			visible: false
		});
	}
}
