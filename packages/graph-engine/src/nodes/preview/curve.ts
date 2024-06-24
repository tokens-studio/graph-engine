import { CurveSchema } from '../../schemas';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition extends Node {
	static title = 'PreviewCurve';
	static type = 'studio.tokens.preview.curve';

	static description = 'Previews a curve';

	constructor(props) {
		super(props);

        this.addInput("value", {
            type: CurveSchema,
        });
    }
}
