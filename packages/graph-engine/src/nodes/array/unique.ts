import { AnyArraySchema } from '../../schemas/index.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Unique Array';
	static type = 'studio.tokens.array.unique';
	static description = 'Removes duplicate elements from an array';

	declare inputs: ToInput<{
		array: T[];
	}>;

	declare outputs: ToOutput<{
		value: T[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('array', {
			type: AnyArraySchema
		});
		this.addOutput('value', {
			type: AnyArraySchema
		});
	}

	execute(): void | Promise<void> {
		const { array } = this.getAllInputs();
		// Use Set to remove duplicates and convert back to array
		const uniqueArray = [...new Set(array)];
		this.outputs.value.set(uniqueArray, this.inputs.array.type);
	}
}
