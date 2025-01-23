import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { StringSchema } from '../../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Math Expression';
	static type = 'studio.tokens.preview.mathExpression';

	static description = 'Visuaize a math expression';

	constructor(props) {
		super(props);

		this.addInput('value', {
			type: StringSchema
		});
	}
}
