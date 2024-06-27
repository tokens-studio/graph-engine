import { AnyArraySchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
export default class NodeDefinition<T> extends Node {
	static title = 'Reverse Array';
	static type = 'studio.tokens.array.reverse';
	static description = 'Reverses a given array without mutating the original';

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
		const array = this.getRawInput('array');
		//Normal reverse mutates the array. We don't want that.
		const reversed = [...array.value].reverse();

		this.setOutput('value', reversed, array.type);
	}
}
