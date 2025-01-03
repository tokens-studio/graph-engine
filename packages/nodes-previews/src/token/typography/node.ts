import { Node } from '@tokens-studio/graph-engine';
import { TokenSchema } from '@tokens-studio/graph-engine-nodes-design-tokens';
import { arrayOf } from '../../utils/index.js';

export default class NodeDefinition extends Node {
	static title = 'Typography Preview';
	static type = 'studio.tokens.previews.tokens.typography';
	static description = 'Displays typography tokens with visual preview';

	constructor(props) {
		super(props);

		this.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}
}
