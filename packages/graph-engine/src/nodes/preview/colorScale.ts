import { ColorSchema } from '../../schemas/index.js';
import { Node } from '../../programmatic/node.js';
import { arrayOf } from '../../schemas/utils.js';

export default class NodeDefinition extends Node {
	static title = 'Color Scale';
	static type = 'studio.tokens.preview.colorScale';

	static description = 'Previews a color scale';

	constructor(props) {
		super(props);

		this.addInput('value', {
			type: arrayOf(ColorSchema)
		});
	}
}
