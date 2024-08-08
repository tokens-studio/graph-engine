import { BackgroundColor, Color, Theme } from '@adobe/leonardo-contrast-colors';
import {
	ColorSchema,
	Color as ColorType,
	DataflowNode,
	INodeDefinition,
	NumberSchema,
	ToInput,
	ToOutput,
	hexToColor
} from '@tokens-studio/graph-engine';
import { LeonardoColor } from './leonardoColor.js';
import { LeonardoColorSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class LeonardoThemeNode extends DataflowNode {
	static title = 'Leonardo Theme';
	static type = 'studio.tokens.design.leonardo.theme';
	static description = 'Creates a leonardo theme';
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('colors', {
			type: arrayOf(LeonardoColorSchema)
		});
		this.dataflow.addInput('contrast', {
			type: NumberSchema
		});
		this.dataflow.addInput('lightness', {
			type: NumberSchema
		});
		this.dataflow.addInput('saturation', {
			type: NumberSchema
		});
		this.dataflow.addInput('backgroundColor', {
			type: LeonardoColorSchema
		});

		this.dataflow.addOutput('colors', {
			type: arrayOf(ColorSchema)
		});
	}

	declare inputs: ToInput<{
		colors: LeonardoColor[];
		contrast: number;
		lightness: number;
		saturation: number;
		backgroundColor: LeonardoColor;
	}>;
	declare outputs: ToOutput<{
		colors: ColorType[];
	}>;

	execute(): void | Promise<void> {
		const { backgroundColor, colors, contrast, saturation, lightness } =
			this.getAllInputs();

		const theme = new Theme({
			colors: colors.map(x => new Color(x)),
			contrast,
			saturation,
			backgroundColor: new BackgroundColor(backgroundColor),
			lightness
		});

		const themeColors = theme.contrastColorValues.map(x => hexToColor(x));

		this.outputs.colors.set(themeColors);
	}
}
