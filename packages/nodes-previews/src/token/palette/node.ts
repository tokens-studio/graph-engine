import { Node } from '@tokens-studio/graph-engine';
import { StringSchema } from '@tokens-studio/graph-engine';
import { TokenSetSchema } from '@tokens-studio/graph-engine-nodes-design-tokens';

export default class NodeDefinition extends Node {
	static title = 'Color Palette';
	static type = 'studio.tokens.previews.tokens.palette';
	static description = 'Displays a color palette with grouped swatches';

	constructor(props) {
		super(props);

		this.addInput('tokenSet', {
			type: TokenSetSchema
		});

		this.addInput('path', {
			type: StringSchema
		});
	}
}
