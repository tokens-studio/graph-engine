import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Number';
	static type = 'studio.tokens.preview.number';

	static description = 'Previews a number';

	constructor(props) {
		super(props);

		this.dataflow.addInput('value', {
			type: { ...NumberSchema, default: 0 }
		});

		this.dataflow.addInput('precision', {
			type: { ...NumberSchema, default: 2 }
		});
	}
}
