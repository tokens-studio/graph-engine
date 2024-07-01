import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Clamp';
	static type = 'studio.tokens.math.clamp';
	static description =
		'Clamp node allows you to restricts a value within a specified minimum and maximum range.';

	declare inputs: ToInput<{
		value: number;
		min: number;
		max: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('min', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('max', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { value, min, max } = this.getAllInputs();
		this.setOutput('value', value > max ? max : value < min ? min : value);
	}
}
