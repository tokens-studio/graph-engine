import { ColorSchema, Node } from '@tokens-studio/graph-engine';

export default class NodeDefinition extends Node {
	static title = 'Color Swatch';
	static type = 'studio.tokens.previews.color.swatch';
	static description = 'Previews a single color';

	constructor(props) {
		super(props);

		this.addInput('color', {
			type: ColorSchema
		});
	}
} 