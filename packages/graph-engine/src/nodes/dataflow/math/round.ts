import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { setToPrecision } from '../../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Round';
	static type = 'studio.tokens.math.round';
	static description =
		'Round node allows you to adjusts a floating-point number to the nearest integer or to a specified precision.';

	declare inputs: ToInput<{
		value: number;
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
				default: 0
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 0
			}
		});

		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { precision, value } = this.getAllInputs();
		this.outputs.value.set(setToPrecision(value, precision));
	}
}
