import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/nodes/node.js';
import { NumberSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Fluid';
	static type = 'studio.tokens.math.fluid';
	static description =
		'Fluid node allows you to dynamically calculates a dimension based on the current viewport width, transitioning smoothly between a minimum and maximum dimension as the viewport width changes within a defined range (from min viewport to max viewport)';

	declare inputs: ToInput<{
		minSize: number;
		maxSize: number;
		minViewport: number;
		maxViewport: number;
		viewport: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('minSize', {
			type: NumberSchema
		});
		this.addInput('maxSize', {
			type: NumberSchema
		});
		this.addInput('minViewport', {
			type: NumberSchema
		});
		this.addInput('maxViewport', {
			type: NumberSchema
		});
		this.addInput('viewport', {
			type: NumberSchema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { minSize, maxSize, minViewport, maxViewport, viewport } =
			this.getAllInputs();
		const fontV = (100 * (maxSize - minSize)) / (maxViewport - minViewport);
		const fontR =
			(minViewport * maxSize - maxViewport * minSize) /
			(minViewport - maxViewport);
		const fluid = (viewport / 100) * fontV + fontR;
		const clamped = Math.min(maxSize, Math.max(minSize, fluid));

		this.outputs.value.set(clamped);
	}
}
