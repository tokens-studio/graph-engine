import { Node } from '@tokens-studio/graph-engine';
import { TokenSchema } from '@tokens-studio/graph-engine-nodes-design-tokens';
import { arrayOf } from '../../utils/index.js';

export default class NodeDefinition extends Node {
	static title = 'Dimension Scale';
	static type = 'studio.tokens.previews.dimension.scale';
	static description = 'Previews a scale of dimension tokens';

	constructor(props) {
		super(props);

		this.addInput('scale', {
			type: arrayOf(TokenSchema)
		});
	}
}
