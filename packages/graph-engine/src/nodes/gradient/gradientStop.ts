import {
	ColorSchema,
	GradientStopSchema,
	NumberSchema
} from '../../schemas/index.js';
import { INodeDefinition } from '../../index.js';
import { Node } from '../../programmatic/nodes/node.js';

export default class NodeDefinition extends Node {
	static title = 'Gradient Stop';
	static type = 'studio.tokens.gradient.stop';
	static description = 'Create a gradient stop.';

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: ColorSchema
		});
		this.addInput('position', {
			type: NumberSchema
		});
		this.addOutput('gradientStop', {
			type: GradientStopSchema
		});
	}

	execute(): void | Promise<void> {
		const { color, position } = this.getAllInputs();
		this.outputs.gradientStop.set({ color: color, position: position });
	}
}
