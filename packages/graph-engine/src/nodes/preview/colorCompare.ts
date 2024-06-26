import { ColorSchema } from '../../schemas/index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition extends Node {
	static title = 'Color Compare';
	static type = 'studio.tokens.preview.colorCompare';

	static description = 'Compares colors';

	constructor(props) {
		super(props);

        this.addInput("colorA", {
            type: ColorSchema,
        });

        this.addInput("colorB", {
            type: ColorSchema,
        });
    }
}
