import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
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
		precision: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('minSize', {
			type: {
				...NumberSchema,
				default: 16,
				description: 'Minimum size in pixels'
			}
		});
		this.addInput('maxSize', {
			type: {
				...NumberSchema,
				default: 24,
				description: 'Maximum size in pixels'
			}
		});
		this.addInput('minViewport', {
			type: {
				...NumberSchema,
				default: 320,
				description: 'Minimum viewport width in pixels'
			}
		});
		this.addInput('maxViewport', {
			type: {
				...NumberSchema,
				default: 1920,
				description: 'Maximum viewport width in pixels'
			}
		});
		this.addInput('viewport', {
			type: {
				...NumberSchema,
				default: 768,
				description: 'Current viewport width in pixels'
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2,
				minimum: 0,
				description: 'Number of decimal places in the output'
			}
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { minSize, maxSize, minViewport, maxViewport, viewport, precision } =
			this.getAllInputs();

		// Get the actual min and max values regardless of input order
		const actualMinSize = Math.min(minSize, maxSize);
		const actualMaxSize = Math.max(minSize, maxSize);
		const actualMinViewport = Math.min(minViewport, maxViewport);
		const actualMaxViewport = Math.max(minViewport, maxViewport);

		// Handle equal viewport case
		if (actualMinViewport === actualMaxViewport) {
			this.outputs.value.set(setToPrecision(actualMinSize, precision));
			return;
		}

		const fontV =
			(100 * (actualMaxSize - actualMinSize)) /
			(actualMaxViewport - actualMinViewport);
		const fontR =
			(actualMinViewport * actualMaxSize - actualMaxViewport * actualMinSize) /
			(actualMinViewport - actualMaxViewport);
		const fluid = (viewport / 100) * fontV + fontR;
		const clamped = Math.min(actualMaxSize, Math.max(actualMinSize, fluid));

		this.outputs.value.set(setToPrecision(clamped, precision));
	}
}
