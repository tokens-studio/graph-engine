import { ColorSchema } from '../../schemas';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition extends Node {
	static title = 'Color Swatch';
	static type = 'studio.tokens.preview.swatch';

	static description = 'Previews a color swatch';

	constructor(props) {
		super(props);

        this.addInput("value", {
            type: ColorSchema,
        });
    }
}
