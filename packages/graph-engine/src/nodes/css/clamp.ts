import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'CSS Clamp';
	static type = 'studio.tokens.css.clamp';
	static description = 'Generates a CSS clamp function for fluid typography';

	declare inputs: ToInput<{
		minSize: number;
		maxSize: number;
		minViewport: number;
		maxViewport: number;
		baseFontSize: number;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('minSize', {
			type: {
				...NumberSchema,
				default: 16,
				description: 'Minimum font size in pixels'
			}
		});
		this.addInput('maxSize', {
			type: {
				...NumberSchema,
				default: 24,
				description: 'Maximum font size in pixels'
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
		this.addInput('baseFontSize', {
			type: {
				...NumberSchema,
				default: 16,
				description:
					'Base font size in pixels (usually browser default of 16px)'
			}
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { minSize, maxSize, minViewport, maxViewport, baseFontSize } =
			this.getAllInputs();

		// Convert sizes to rem
		const minSizeRem = minSize / baseFontSize;
		const maxSizeRem = maxSize / baseFontSize;

		// Calculate the preferred value parameters
		const slope = (maxSize - minSize) / (maxViewport - minViewport);
		const viewportValue = slope * 100; // Convert to vw units
		const intersect = minSize - slope * minViewport;
		const relativeValue = intersect / baseFontSize; // Convert to rem

		// Format the values to 4 decimal places for precision
		const formattedMin = Number(minSizeRem.toFixed(3));
		const formattedMax = Number(maxSizeRem.toFixed(3));
		const formattedVw = Number(viewportValue.toFixed(3));
		const formattedRel = Number(relativeValue.toFixed(3));

		// Construct the clamp function
		const clampValue = `clamp(${formattedMin}rem, calc(${formattedVw}vw + ${formattedRel}rem), ${formattedMax}rem)`;

		this.outputs.value.set(clampValue);
	}
}
