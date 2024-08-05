import {
	BooleanSchema,
	Color,
	ColorSchema,
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput,
	toColor,
	toHex
} from '@tokens-studio/graph-engine';
import { LeonardoColorSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export type LeonardoColor = {
	name: string;
	colorKeys: Color[];
	ratios: number[];
	smooth: boolean;
};

export default class LeonardoColorNode extends Node {
	static title = 'Leonardo Color';
	static type = 'studio.tokens.design.leonardo.color';
	static description = 'Creates a leonardo color';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema
		});
		this.addInput('colorKeys', {
			type: arrayOf(ColorSchema)
		});
		this.addInput('ratios', {
			type: arrayOf(NumberSchema)
		});

		this.addInput('smooth', {
			type: BooleanSchema
		});
		this.addOutput('value', {
			type: LeonardoColorSchema
		});
	}

	declare inputs: ToInput<{
		name: string;
		colorKeys: Color[];
		ratios: number[];
		smooth: boolean;
	}>;

	declare outputs: ToOutput<{
		value: LeonardoColor;
	}>;

	execute(): void | Promise<void> {
		const { name, colorKeys, ratios, smooth } = this.getAllInputs();

		//Because the color is mutated inside of the object, we create a plain object and expect downstream nodes to handle the mutation
		const color = {
			name,
			colorKeys: colorKeys.map(x => toHex(toColor(x))),
			ratios,
			smooth
		};
		this.outputs.value.set(color);
	}
}
