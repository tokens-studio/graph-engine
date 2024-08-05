import { CurveSchema } from '../../schemas/index.js';
import { Node } from '../../programmatic/nodes/node.js';

export default class NodeDefinition extends Node {
	static title = 'PreviewCurve';
	static type = 'studio.tokens.preview.curve';

	static description = 'Previews a curve';

	constructor(props) {
		super(props);

		this.addInput('value', {
			type: CurveSchema
		});
	}
}
