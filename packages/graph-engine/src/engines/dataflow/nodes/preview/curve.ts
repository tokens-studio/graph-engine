import { CurveSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';

export default class NodeDefinition extends DataflowNode {
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
