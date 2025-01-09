import { Node } from '@tokens-studio/graph-engine';
import { TokenSchema } from '@tokens-studio/graph-engine-nodes-design-tokens';
import { arrayOf } from '../../utils/index.js';

export default class NodeDefinition extends Node {
	static title = 'Token Table';
	static type = 'studio.tokens.previews.tokens.table';
	static description = 'Displays tokens in a table format';

	constructor(props) {
		super(props);

		this.addInput('tokens', {
			type: arrayOf(TokenSchema)
		});
	}
}
