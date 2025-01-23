import {
	BooleanSchema,
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../../schemas/index.js';
import { Color, INodeDefinition } from '../../../index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { Poline, PositionFunction, Vector3, positionFunctions } from 'poline';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { arrayOf } from '../../../schemas/utils.js';
import { toColor } from './lib/utils.js';

export type PolineNodeOptions = {
	anchorColors: Vector3[];
	numPoints: number;
	invertedLightness?: boolean;
	positionFunctionX?: PositionFunction;
	positionFunctionY?: PositionFunction;
	positionFunctionZ?: PositionFunction;
};

const positionFuncs = Object.keys(positionFunctions);

export default class NodeDefinition extends DataflowNode {
	static title = 'Poline';
	static type = 'studio.tokens.color.poline';
	static description = '';

	declare inputs: ToInput<{
		anchorColors: Color[];
		numPoints: number;
		invertedLightness: boolean;
		positionFnX: string;
		positionFnY: string;
		positionFnZ: string;
		hueShift: number;
	}>;

	declare outputs: ToOutput<{
		value: Color[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('anchorColors', {
			type: arrayOf(ColorSchema)
		});
		this.addInput('numPoints', {
			type: {
				...NumberSchema,
				default: 4
			}
		});
		this.addInput('invertedLightness', {
			type: BooleanSchema
		});
		this.addInput('positionFnX', {
			type: {
				...StringSchema,
				enum: positionFuncs
			}
		});
		this.addInput('positionFnY', {
			type: {
				...StringSchema,
				enum: positionFuncs
			}
		});
		this.addInput('positionFnZ', {
			type: {
				...StringSchema,
				enum: positionFuncs
			}
		});

		this.addInput('hueShift', {
			type: NumberSchema
		});
		this.dataflow.addOutput('value', {
			type: arrayOf(ColorSchema)
		});
	}

	execute(): void | Promise<void> {
		const {
			numPoints,
			hueShift,
			anchorColors,
			positionFnX,
			positionFnY,
			positionFnZ,
			invertedLightness
		} = this.getAllInputs();

		if (!anchorColors || anchorColors.length < 2) {
			throw new Error('Not enough color inputs');
		}

		//Poline only deals in hsl
		const hsl = anchorColors.map(col => {
			const hslColor = toColor(col).to('hsl');
			return [hslColor.h ?? 0, hslColor.s, hslColor.l];
		});

		const polineOptions: PolineNodeOptions = {
			invertedLightness,
			numPoints,
			anchorColors: hsl,
			positionFunctionX:
				positionFunctions[positionFnX ? positionFnX : 'sinusoidalPosition'],
			positionFunctionY:
				positionFunctions[positionFnY ? positionFnY : 'sinusoidalPosition'],
			positionFunctionZ:
				positionFunctions[positionFnZ ? positionFnZ : 'sinusoidalPosition']
		};

		const poline = new Poline(polineOptions);
		if (hueShift) {
			poline.shiftHue(hueShift);
		}
		//Note that we lose the alpha channels here
		const colors: Color[] = poline.colors.map(([h, s, l]) => {
			return {
				space: 'hsl',
				channels: [h, s, l]
			};
		});
		this.outputs.value.set(colors);
	}
}
