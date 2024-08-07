import {
	ColorSchema,
	GradientStopSchema,
	NumberSchema
} from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Gradient Stop';
	static type = 'studio.tokens.gradient.stop';
	static description = 'Create a gradient stop.';

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('color', {
			type: ColorSchema
		});
		this.dataflow.addInput('position', {
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
