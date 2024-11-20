import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'CSS Accessible Clamp';
	static type = 'studio.tokens.css.accessibleClamp';
	static description =
		'Generates a CSS clamp function for fluid typography that uses rem in addition to ensure accessible values.';

	declare inputs: ToInput<{
		minSize: number;
		maxSize: number;
		minViewport: number;
		maxViewport: number;
		baseFontSize: number;
		precision: number;
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
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 3,
				minimum: 0,
				description: 'Number of decimal places in the output'
			}
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const {
			minSize,
			maxSize,
			minViewport,
			maxViewport,
			baseFontSize,
			precision
		} = this.getAllInputs();

		// Convert sizes to rem
		const minSizeRem = minSize / baseFontSize;
		const maxSizeRem = maxSize / baseFontSize;

		// Calculate the preferred value parameters
		const slope = (maxSize - minSize) / (maxViewport - minViewport);
		const viewportValue = slope * 100; // Convert to vw units
		const intersect = minSize - slope * minViewport;
		const relativeValue = intersect / baseFontSize; // Convert to rem

		// Format the values with specified precision
		const formattedMin = Number(minSizeRem.toFixed(precision));
		const formattedMax = Number(maxSizeRem.toFixed(precision));
		const formattedVw = Number(viewportValue.toFixed(precision));
		const formattedRel = Number(relativeValue.toFixed(precision));

		// Construct the clamp function
		const clampValue = `clamp(${formattedMin}rem, calc(${formattedVw}vw + ${formattedRel}rem), ${formattedMax}rem)`;

		this.outputs.value.set(clampValue);
	}
}
