import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/nodes/node.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Power';
	static type = 'studio.tokens.math.pow';
	static description =
		'Power node allows you to Raises a base number to the power of an exponent.';

	declare inputs: ToInput<{
		base: number;
		exponent: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('base', {
			type: NumberSchema
		});
		this.addInput('exponent', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { base, exponent } = this.getAllInputs();
		this.outputs.value.set(Math.pow(base, exponent));
	}
}
