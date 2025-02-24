import { Color } from '../../types.js';
import { ColorSchema } from '../../schemas';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { ToInput } from '../../index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Color Compare';
	static type = 'studio.tokens.preview.colorCompare';
	static description = 'Compares colors';

	declare inputs: ToInput<{
		colorA: Color;
		colorB: Color;
	}>;

	constructor(props) {
		super(props);

		this.dataflow.addInput('colorA', {
			type: {
				...ColorSchema,
				default: '#ffffff'
			}
		});

		this.dataflow.addInput('colorB', {
			type: {
				...ColorSchema,
				default: '#000000'
			}
		});
	}
}
