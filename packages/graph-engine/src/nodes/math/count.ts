import { INodeDefinition, ToInput, ToOutput } from '../../index.js';

import { AnyArraySchema, NumberSchema } from '../../schemas/index.js';
import { Node } from '../../programmatic/nodes/node.js';

export default class NodeDefinition extends Node {
	static title = 'Count';
	static type = 'studio.tokens.math.count';
	static description = 'Counts the amount of items in an array.';

	declare inputs: ToInput<{
		value: any[];
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: AnyArraySchema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		this.outputs.value.set(this.inputs.value.value.length);
	}
}
