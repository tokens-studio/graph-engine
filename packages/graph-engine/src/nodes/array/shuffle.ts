import { AnyArraySchema } from '../../schemas/index.js';
import { INodeDefinition, Node } from '../../programmatic/node.js';
import { ToInput, ToOutput } from '../../programmatic/index.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Shuffle Array';
	static type = 'studio.tokens.array.shuffle';
	static description =
		'Randomly reorders elements in an array using Fisher-Yates algorithm';

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

		// Create a copy of the array to avoid mutating the input
		const shuffled = [...array];

		// Fisher-Yates shuffle algorithm
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		this.outputs.value.set(shuffled, this.inputs.array.type);
	}
}
