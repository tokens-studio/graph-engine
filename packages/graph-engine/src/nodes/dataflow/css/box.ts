import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema, StringSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'CSS Box';
	static type = 'studio.tokens.css.box';
	static description =
		'CSS Box node allows you to generate a CSS box from 4 values';

	declare inputs: ToInput<{
		top: number;
		right: number;
		bottom: number;
		left: number;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('top', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('right', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('bottom', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('left', {
			type: {
				...NumberSchema,
				default: 0
			}
		});

		this.dataflow.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { top, right, bottom, left } = this.getAllInputs();
		this.outputs.value.set(`${top} ${right} ${bottom} ${left}`);
	}
}
