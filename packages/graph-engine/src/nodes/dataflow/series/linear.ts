import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { arrayOf } from '../../../schemas/utils.js';
import { setToPrecision } from '../../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Linear Space';
	static type = 'studio.tokens.series.linear';
	static description =
		'Creates evenly spaced numbers over a specified interval';

	declare inputs: ToInput<{
		start: number;
		stop: number;
		length: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('start', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('stop', {
			type: {
				...NumberSchema,
				default: 1
			}
		});
		this.addInput('length', {
			type: {
				...NumberSchema,
				default: 5
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.addOutput('array', {
			type: arrayOf(NumberSchema)
		});
	}

	execute(): void | Promise<void> {
		const { start, stop, length, precision } = this.getAllInputs();

		if (length <= 1) {
			this.outputs.array.set([setToPrecision(start, precision)]);
			return;
		}

		const step = (stop - start) / (length - 1);
		const values = Array.from({ length: length }).map((_, i) =>
			setToPrecision(start + step * i, precision)
		);

		this.outputs.array.set(values);
	}
}
