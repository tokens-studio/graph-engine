import { Color, GradientStop } from '@/types.js';
import {
	ColorSchema,
	GradientStopSchema,
	NumberSchema
} from '@/schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Gradient Stop';
	static type = 'studio.tokens.gradient.stop';
	static description = 'Create a gradient stop.';

	declare inputs: ToInput<{
		color: Color;
		position: number;
	}>;
	declare outputs: ToOutput<{
		gradientStop: GradientStop;
	}>;

	constructor(props) {
		super(props);
		this.addInput('color', {
			type: ColorSchema
		});
		this.addInput('position', {
			type: NumberSchema
		});
		this.dataflow.addOutput('gradientStop', {
			type: GradientStopSchema
		});
	}

	execute(): void | Promise<void> {
		const { color, position } = this.getAllInputs();
		this.outputs.gradientStop.set({ color: color, position: position });
	}
}
