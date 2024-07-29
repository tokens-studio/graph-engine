import { Color } from '../../types.js';
import { ColorSchema } from '../../schemas';
import { Node } from '../../programmatic/node.js';
import { ToInput } from '../../index.js';

export default class NodeDefinition extends Node {
	static title = 'Color Compare';
	static type = 'studio.tokens.preview.colorCompare';
	static description = 'Compares colors';

	declare inputs: ToInput<{
		colorA: Color;
		colorB: Color;
	}>;

	constructor(props) {
		super(props);

		this.addInput('colorA', {
			type: {
				...ColorSchema,
				default: '#ffffff'
			}
		});

		this.addInput('colorB', {
			type: {
				...ColorSchema,
				default: '#000000'
			}
		});
	}
}
