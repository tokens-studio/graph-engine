import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema } from '../../schemas/index.js';
import { setToPrecision } from '../../utils/precision.js';

export default class NodeDefinition extends DataflowNode {
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
		precision: number;
	}>;

	declare outputs: ToOutput<{
		value: number;
	}>;

	static description =
		'calculate the base font size with DIN 1450. The output is a number representing the font size in pixels.';

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('visualAcuity', {
			type: {
				...NumberSchema,
				default: 0.7
			}
		});
		this.dataflow.addInput('correctionFactor', {
			type: {
				...NumberSchema,
				default: 13
			}
		});
		this.dataflow.addInput('lightingCondition', {
			type: {
				...NumberSchema,
				default: 0.83
			}
		});
		this.dataflow.addInput('distance', {
			type: {
				...NumberSchema,
				default: 30
			}
		});

		this.dataflow.addInput('xHeightRatio', {
			type: {
				...NumberSchema,
				default: 0.53
			}
		});

		this.dataflow.addInput('ppi', {
			type: {
				...NumberSchema,
				default: 458
			}
		});
		this.dataflow.addInput('pixelDensity', {
			type: {
				...NumberSchema,
				default: 3
			}
		});
		this.dataflow.addInput('precision', {
			type: {
				...NumberSchema,
				default: 0
			}
		});

		this.dataflow.addOutput('value', {
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
