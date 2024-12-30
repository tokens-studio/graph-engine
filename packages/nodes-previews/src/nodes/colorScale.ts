import { ColorSchema, Node } from '@tokens-studio/graph-engine';
import { arrayOf } from '../utils/index.js';

export default class NodeDefinition extends Node {
	static title = 'Color Scale';
	static type = 'studio.tokens.previews.colorScale';

	static description = 'Previews a color scale';

	constructor(props) {
		super(props);

		this.addInput('scale', {
			type: arrayOf(ColorSchema)
		});
	}
}
