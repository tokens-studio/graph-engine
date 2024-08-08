import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../programmatic/nodes/node.js';
import { ObjectSchema } from '../../schemas/index.js';
import { annotatedDynamicInputs } from '../../annotations/index.js';

/**
 * Similar to the Objectify node, this expects that inputs will be added to it dynamically.
 * Technically this performs the exact same function as the Objectify node, but it's more
 * convenient to have a node here that could use strong typing on the property names if need
 * be. Note that you should using something like the "mdn-data" package to get the list of
 * properties and their types. This is just a convenience node.
 */
export default class NodeDefinition extends DataflowNode {
	static title = 'CSS Map';
	static type = 'studio.tokens.css.map';

	static description =
		'Exposes all the css properties. You can link the input of any other node to the any property that is there in the css map node.';
	constructor(props: INodeDefinition) {
		super(props);

		//Indaicate that is uses dynamic inputs
		this.annotations[annotatedDynamicInputs] = true;
		this.dataflow.addOutput('value', {
			type: ObjectSchema
		});
	}

	execute(): void | Promise<void> {
		const inputs = this.getAllInputs();
		const output = Object.entries(inputs).reduce((acc, [key, value]) => {
			if (value !== undefined) {
				acc[key] = value;
			}
			return acc;
		}, {});

		this.outputs.value.set(output);
	}
}
