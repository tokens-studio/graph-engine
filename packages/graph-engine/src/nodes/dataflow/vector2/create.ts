import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema, Vec2Schema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { Vec2 } from '../../../index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Create vector2';
	static type = 'studio.tokens.vector2.create';
	static description = 'Allows you to create a vector2';

	declare inputs: ToInput<{
		x: number;
		y: number;
	}>;

	declare outputs: ToOutput<{
		value: Vec2;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('x', {
			type: NumberSchema
		});
		this.addInput('y', {
			type: NumberSchema
		});
		this.dataflow.addOutput('value', {
			type: Vec2Schema
		});
	}

	execute(): void | Promise<void> {
		const { x, y } = this.getAllInputs();
		this.outputs.value.set([x, y]);
	}
}
