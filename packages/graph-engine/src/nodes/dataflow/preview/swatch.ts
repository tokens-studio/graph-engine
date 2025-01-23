import { ColorSchema } from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Color Swatch';
	static type = 'studio.tokens.preview.swatch';

	static description = 'Previews a color swatch';

	constructor(props) {
		super(props);

		this.addInput('value', {
			type: ColorSchema
		});
	}
}
