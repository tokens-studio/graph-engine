import { IDeserializeOpts } from '../../graph/types.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import {
	annotatedDynamicInputs,
	annotatedSingleton
} from '../../annotations/index.js';

/**
 * Acts as an output node for the graph. There should only be a single output node per graph.
 */
export default class NodeDefinition extends Node {
	static title = 'Output';
	static type = 'studio.tokens.generic.output';

	static description = 'Allows you to expose outputs of the node';
	constructor(props: INodeDefinition) {
		super(props);
		this.annotations[annotatedSingleton] = true;
		this.annotations[annotatedDynamicInputs] = true;
	}

	static override async deserialize(opts: IDeserializeOpts) {
		const node = await super.deserialize(opts);

		//Create the outputs immediately as we are just a passthrough
		Object.keys(node.inputs).forEach(input => {
			const rawInput = node.getRawInput(input);
			node.addOutput(input, {
				visible: false,
				type: rawInput.type
			});
		});

		return node;
	}

	execute(): void | Promise<void> {
		const inputs = this.getAllInputs();
		const outputs = this.getAllOutputs();

		//Passthrough all
		Object.keys(inputs).forEach(input => {
			const rawInput = this.getRawInput(input);

			if (!(input in outputs)) {
				this.addOutput(input, {
					type: rawInput.type,
					visible: false
				});
			}

			this.setOutput(input, rawInput.value, rawInput.type);
		});

		Object.keys(outputs).forEach(output => {
			if (!(output in inputs)) {
				delete this.outputs[output];
			}
		});
	}
}
