import {
	BooleanSchema,
	Color,
	ColorSchema,
	DataflowNode,
	INodeDefinition,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput,
	toColor,
	toHex
} from '@tokens-studio/graph-engine';
import { CssColor } from '@adobe/leonardo-contrast-colors';
import { LeonardoColorSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export type LeonardoColor = {
	name: string;
	colorKeys: CssColor[];
	ratios: number[];
	smooth: boolean;
};

export default class LeonardoColorNode extends DataflowNode {
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
		this.dataflow.addOutput('value', {
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
			colorKeys: colorKeys.map(x => toHex(toColor(x)) as CssColor),
			ratios,
			smooth
		};
		this.outputs.value.set(color);
	}
}
