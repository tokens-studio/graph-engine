import { AnySchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition<T> extends Node {
	static title = 'Delay';
	static type = 'studio.tokens.generic.delay';
	static description =
		'When trigger, it will output the provided value after a delay';

	declare inputs: ToInput<{
		value: T;
		/**
		 * The delay in milliseconds
		 * @default 1000
		 */
		delay: number;
	}>;
	declare outputs: ToOutput<{
		value: T;
	}>;

	_interval: NodeJS.Timer | null = null;
	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('value', {
			type: AnySchema
		});
		this.addInput('delay', {
			type: {
				...NumberSchema,
				default: 1000
			}
		});
		this.addOutput('value', {
			type: AnySchema
		});
	}
	async execute() {
		const { delay } = this.getAllInputs();
		const raw = this.inputs.value;

		return new Promise<void>(resolve => {
			setTimeout(() => {
				this.outputs.value.set(raw.value, raw.type);
				resolve();
			}, delay);
		});
	}
}
