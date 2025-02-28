import { Node } from '../../programmatic/node.js';
import { StringSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Math Expression';
	static type = 'studio.tokens.preview.mathExpression';

	static description = 'Visualize a math expression';

	static annotations: Record<string, unknown> = {
		deprecated: true
	};

	constructor(props) {
		super(props);

		this.addInput('value', {
			type: StringSchema
		});
	}
}
