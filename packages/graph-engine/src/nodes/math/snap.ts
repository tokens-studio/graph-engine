import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';
import { ValueSnapMethod } from '../../types/index.js';

export default class NodeDefinition extends Node {
	static title = 'Snap';
	static type = 'studio.tokens.math.snap';
	static description =
		'Snap node rounds the input value to the nearest multiple of the increment, offset by the base.';

	declare inputs: ToInput<{
		value: number;
		method: ValueSnapMethod;
		base: number;
		increment: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: {
				...NumberSchema,
				default: 3
			}
		});
		this.addInput('method', {
			type: {
				...StringSchema,
				enum: Object.values(ValueSnapMethod),
				default: ValueSnapMethod.Round
			}
		});
		this.addInput('base', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('increment', {
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
		const { value, method, base, increment } = this.getAllInputs();

		let snap: (x: number) => number;

		switch (method) {
			case ValueSnapMethod.Floor:
				snap = Math.floor;
				break;
			case ValueSnapMethod.Round:
			default:
				snap = Math.round;
				break;
			case ValueSnapMethod.Ceil:
				snap = Math.ceil;
				break;
		}

		this.outputs.value.set(base + increment * snap((value - base) / increment));
	}
}
