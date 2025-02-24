import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema, Vec2Schema } from '../../schemas/index.js';
import { Vec2 } from '../../index.js';

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

		this.dataflow.addInput('x', {
			type: NumberSchema
		});
		this.dataflow.addInput('y', {
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
