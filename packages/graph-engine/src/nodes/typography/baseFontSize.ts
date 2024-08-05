import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/nodes/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends Node {
	static title = 'Base Font Size';
	static type = 'studio.tokens.typography.baseFontSize';

	declare inputs: ToInput<{
		visualAcuity: number;
		/**
		 * The correct factor
		 */
		correctionFactor: number;
		lightingCondition: number;
		distance: number;
		xHeightRatio: number;
		ppi: number;
		pixelDensity: number;
	}>;

	declare outputs: ToOutput<{
		value: number;
	}>;

	static description =
		'calculate the base font size with DIN 1450. The output is a number representing the font size in pixels.';

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('visualAcuity', {
			type: {
				...NumberSchema,
				default: 0.7
			}
		});
		this.addInput('correctionFactor', {
			type: {
				...NumberSchema,
				default: 13
			}
		});
		this.addInput('lightingCondition', {
			type: {
				...NumberSchema,
				default: 0.83
			}
		});
		this.addInput('distance', {
			type: {
				...NumberSchema,
				default: 30
			}
		});

		this.addInput('xHeightRatio', {
			type: {
				...NumberSchema,
				default: 0.53
			}
		});

		this.addInput('ppi', {
			type: {
				...NumberSchema,
				default: 458
			}
		});
		this.addInput('pixelDensity', {
			type: {
				...NumberSchema,
				default: 3
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 0
			}
		});

		this.addOutput('value', {
			type: {
				...NumberSchema,
				description: 'The generated font size'
			}
		});
	}

	execute(): void | Promise<void> {
		const {
			visualAcuity,
			lightingCondition,
			distance,
			xHeightRatio,
			ppi,
			pixelDensity,
			correctionFactor,
			precision
		} = this.getAllInputs();

		const visualCorrection =
			correctionFactor * (lightingCondition / visualAcuity);
		const xHeightMM =
			Math.tan((visualCorrection * Math.PI) / 21600) * (distance * 10) * 2;
		const xHeightPX = (xHeightMM / 25.4) * (ppi / pixelDensity);
		const fontSizePX = (1 * xHeightPX) / xHeightRatio;

		this.outputs.value.set(setToPrecision(fontSizePX, precision));
	}
}
