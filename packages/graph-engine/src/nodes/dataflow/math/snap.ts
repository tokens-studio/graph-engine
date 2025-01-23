import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema, StringSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { ValueSnapMethod } from '../../../types/index.js';
import { getDecimalCount, setToPrecision } from '@/utils/precision.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Snap';
	static type = 'studio.tokens.math.snap';
	static description =
		'Snap node rounds the input value to the nearest multiple of the increment, offset by the base.';

	declare inputs: ToInput<{
		value: number;
		increment: number;
		base: number;
		method: ValueSnapMethod;
	}>;
	declare outputs: ToOutput<{
		snapped: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: {
				...NumberSchema,
				default: 3
			}
		});
		this.addInput('increment', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.addInput('base', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('method', {
			type: {
				...StringSchema,
				enum: Object.values(ValueSnapMethod),
				default: ValueSnapMethod.Round
			}
		});
		this.addOutput('snapped', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { value, increment, base, method } = this.getAllInputs();

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

		// the output precision is determined by the largest precision of the relevant input values
		const maxDecimals = Math.max(
			getDecimalCount(value),
			getDecimalCount(base),
			getDecimalCount(increment)
		);

		const snapped = setToPrecision(
			base + increment * snap((value - base) / increment),
			maxDecimals
		);

		this.outputs.snapped.set(snapped);
	}
}
