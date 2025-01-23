import { BooleanSchema, NumberSchema } from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { setToPrecision } from '../../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Inverse Linear Mapping';
	static type = 'studio.tokens.series.inverseLinear';
	static description =
		'Maps values from one range to another with optional clamping';

	declare inputs: ToInput<{
		value: number;
		inMin: number;
		inMax: number;
		outMin: number;
		outMax: number;
		clamp: boolean;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: {
				...NumberSchema,
				default: 0.5,
				description: 'Value to map'
			}
		});
		this.addInput('inMin', {
			type: {
				...NumberSchema,
				default: 0,
				description: 'Input range minimum'
			}
		});
		this.addInput('inMax', {
			type: {
				...NumberSchema,
				default: 1,
				description: 'Input range maximum'
			}
		});
		this.addInput('outMin', {
			type: {
				...NumberSchema,
				default: 0,
				description: 'Output range minimum'
			}
		});
		this.addInput('outMax', {
			type: {
				...NumberSchema,
				default: 100,
				description: 'Output range maximum'
			}
		});
		this.addInput('clamp', {
			type: {
				...BooleanSchema,
				default: true,
				description: 'Clamp output to range'
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2,
				minimum: 0
			}
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { value, inMin, inMax, outMin, outMax, clamp, precision } =
			this.getAllInputs();

		let result;
		if (inMax === inMin) {
			result = outMin;
		} else {
			const normalizedValue = (value - inMin) / (inMax - inMin);
			result = outMin + normalizedValue * (outMax - outMin);

			if (clamp) {
				result = Math.min(
					Math.max(result, Math.min(outMin, outMax)),
					Math.max(outMin, outMax)
				);
			}
		}

		this.outputs.value.set(setToPrecision(result, precision));
	}
}
