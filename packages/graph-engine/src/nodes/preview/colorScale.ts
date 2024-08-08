import { ColorSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { arrayOf } from '../../schemas/utils.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Color Scale';
	static type = 'studio.tokens.preview.colorScale';

	static description = 'Previews a color scale';

	constructor(props) {
		super(props);

		this.dataflow.addInput('value', {
			type: arrayOf(ColorSchema)
		});
	}
}
