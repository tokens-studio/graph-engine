import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema, Vec2Schema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { Vec2 } from '../../../index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Destructure vector2';
	static type = 'studio.tokens.vector2.destructure';
	static description =
		'Allows you to destructure a vector2 into its components';

	declare inputs: ToInput<{
		value: Vec2;
	}>;

	declare outputs: ToOutput<{
		x: number;
		y: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: Vec2Schema
		});
		this.dataflow.addOutput('x', {
			type: NumberSchema
		});
		this.dataflow.addOutput('y', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();

		this.outputs.x.set(value[0]);
		this.outputs.y.set(value[1]);
	}
}
